import axios from "axios"
import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState } from "react"


export default function ProtectedRoute({}){
    const [allowed, SetAllowed] = useState(null);
    
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/admin/verify`,{withCredentials:true})
        .then(()=>{
            SetAllowed(true);
        })
        .catch(()=>SetAllowed(false))
    },[]);
    if(allowed === false){
        console.log(allowed + "false");
        return <Navigate to="/admin" replace/> ;
    }
    if(allowed === null){
        console.log(allowed + "null");
        return <p>Checking Auth...</p>;
    }
    console.log(allowed + "true");
    return <Outlet replace/>;
    
}