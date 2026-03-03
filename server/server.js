const express = require("express");
const app = express();
const {connectToDb, getDB}= require("./config/db");
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

let db;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); 
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//   origin: "http://localhost:3000/admin",
//   credentials: true
// }));


connectToDb((err)=>{
    if(!err){
        app.listen('8080',() => console.log("app listening to port 8080"))  
        db = getDB();
    }
    else{
        console.log("There is a error while connecting to db" + err)
    }
})
// ========================= verifying JWT ===================
const authenticateJWT = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"No token Found"})
    }
    jwt.verify(token, process.env.JWT_KEY,(err, decoded)=>{
        if(err){
            return res.status(401).json({message:"Unauthorized access"})
        }
        req.user = decoded;
        next();
    })
}


// ============================================= PROPERTY===========================
app.get("/api/properties", (req, res)=>{
    db.collection("geofences")
    .find()
    .toArray()
    .then((result)=>{
        res.status(200).json(result)
    })
    .catch(err=>res.status(500).json({message:"error while finding data" + err}))
})
app.post("/api/properties",authenticateJWT, (req, res)=>{
    const schemaProperty = req.body;
    db.collection("geofences")
    .insertOne(schemaProperty)
    .then((result)=>{
        res.status(200).json(schemaProperty)
    })
    .catch(err=>res.status(500).json({message:"error while inserting data" + err}))
})
app.patch('/api/properties/:prpId',authenticateJWT,(req, res)=>{
    if(ObjectId.isValid(req.params.prpId)){
        db.collection("geofences")
        .updateOne({_id: new ObjectId(req.params.prpId)},{$set:req.body})
        .then((response)=>res.status(200).json(response))
        .catch((err)=>res.status(500).json(err))  
    }
})
app.delete('/api/properties/:prpId',authenticateJWT,(req, res)=>{
    if(ObjectId.isValid(req.params.prpId)){
        db.collection("geofences")
        .deleteOne({_id: new ObjectId(req.params.prpId)})
        .then((response)=>res.status(200).json(response))
        .catch((err)=>res.status(500).json(err))  
    }
})


// ========================================== AGENT ================================== 
app.post('/api/check-location', async (req, res) => {
    const { agentLng, agentLat, agentName, propertyid } = req.body;
    try {
        const property = await db.collection("geofences").findOne({
            _id: new ObjectId(propertyid),
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(agentLng), parseFloat(agentLat)]
                    },
                    $maxDistance: 50
                }
            }
        });

        if (property) {
            const existingLog = await db.collection('visitingLogs').findOne({
                agentName: agentName,
                propertyId: property._id,
                status: "Active"
            });

            if (!existingLog) {
                await db.collection('visitingLogs').insertOne({
                    agentName: agentName,
                    propertyId: new ObjectId(propertyid),
                    status: "Active",
                    entryTime: new Date(),
                    propertyName: property.name 
                });
                return res.status(200).json({ message: "Welcome! Visit Started." });
            }
            return res.status(200).json({ message: "Agent in zone" });

        } else {
            const activeLog = await db.collection("visitingLogs").findOne({ 
                agentName: agentName, 
                propertyId: new ObjectId(propertyid), 
                status: "Active" 
            });

            if (activeLog) {
                await db.collection("visitingLogs").updateOne(
                    { _id: activeLog._id },
                    { $set: { status: "Completed", exitTime: new Date() } }
                );
                return res.status(200).json({ message: "The Visit Has Been Completed" });
            }
            return res.status(200).json({ message: "" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Logging failed" });
    }
});

// ======================================================= ADMIN========================
app.get('/api/admin/logs',authenticateJWT, async (req, res) => {
    try {
        const logs = await db.collection("visitingLogs")
            .find()
            // .sort({ entryTime: -1 }) 
            .toArray();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: "Could not fetch logs" });
    }
});

/////////////////////////////// Admin Login \\\\\\\\\\\\\\\\\\\
// app.post("/admin/login", async (req, res)=>{
 
//     try {
//         const {username, userpass} = req.body;
//         const hashing = await bcrypt.hash(userpass, 10)
        
//         await db.collection("admin-login")
//         .insertOne({
//             username: username, 
//             userpassword: hashing    
//         })
//         .then(()=>res.status(200).json({message:"Loggedin"}))
        
//     }
//     catch(error){
//         res.status(500).json({message:"denied"})
//     }
// })

//////////////// route protect \\\\\\\\\\\\\\\\
app.get("/admin/verify",authenticateJWT, (req, res)=>{
    if(!req.cookies.token){
        return res.status(401).json({message:"User doesn't have cookie"})
    }
    return res.status(200).json({message:"User has cookies"})
});

app.post("/admin/login",async (req, res)=>{
 
    try {
        const {username, userpass} = req.body;
        const user = await db.collection("admin-login").findOne({username: username}); 
        if(!user){
            return res.status(200).json({message:"Username wrong"});     
        }

        const isMatch = await bcrypt.compare(userpass, user.userpassword);
        if(!isMatch){
            return res.status(200).json({message:"Password doesn't macth"});     
        }
        
        const token = jwt.sign(
                {username : user.username},
                process.env.JWT_KEY,
                {expiresIn: "1h"}
            )
            ///////// sending JWT to client \\\\\\\\\\\
            res.cookie("token", token,{
                httpOnly:true,
                secure:false,
                sameSite:"strict",
                maxAge:60 * 60 * 1000
            });   
            return res.status(200).json({message:"UserLoginSuccess"}); 
    }
    catch(error){
        console.error(error)
        return res.status(500).json({message:"UserLoginFailed"});
    }
});
/////////////////////////////// Admin logout \\\\\\\\\\\\\\\\\\\
app.post("/admin/logout",authenticateJWT, (req, res)=>{
 
    res.clearCookie("token",{
        httpOnly:true,
        secure:false,
        sameSite:"strict"
    })
    res.status(200).json({message:"LoggedOut"})
});

