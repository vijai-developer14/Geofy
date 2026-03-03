const dotenv = require("dotenv");
dotenv.config();

const {MongoClient} = require ("mongodb");
let dbconnection;
module.exports={
    connectToDb:(cb)=>{
        MongoClient.connect(`${process.env.MONGO_URI}`)
        .then(async (client)=>{
            dbconnection = client.db();
            await dbconnection.collection('geofences').createIndex({ location: "2dsphere" });
            console.log("2dsphere index verified");   
            return cb()
        })
        .catch(err=>cb(err))
    },
    getDB:()=> dbconnection
   
}
