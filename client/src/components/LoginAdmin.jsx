import { useContext, useEffect, useState } from "react"
import axios from "axios";
import {useNavigate, Navigate} from "react-router-dom";

export default function LoginAdmin (){

    const [username, SetUserName] = useState();
    const [userpass, SetUserPass] = useState();
    const [isLoginMessage, SetIsLoginMessage] = useState(true);
    const navigate = useNavigate();


    const submt = (e)=>{
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URL}/admin/login`,
            {username,userpass},
            {withCredentials:true}
        )
        .then((response)=>{
            if(response.data.message === "UserLoginSuccess"){
                console.log(response);
                SetIsLoginMessage(true);
                // return <Navigate to="/admin-panel"/>
                navigate("/admin-panel", { replace: true });
            }
            else if(response.data.message === "UserLoginFailed" || "Username wrong" || "Password doesn't macth"){
                console.log(response.data.message);
                SetIsLoginMessage(false);
                // return <Navigate to="/admin"/>
                navigate("/admin", { replace: true });
            }
        })
        .catch((err)=>console.error(err))
    }
    
    
    return(
        <>
            <div className="loginAdmin_bg">
                <form action="" onSubmit={submt}>
                    <p>Login</p>
                    <input type="text" placeholder="Username" onChange={(e)=>(SetUserName(e.target.value))}/>
                    <input type="text" placeholder="Password" onChange={(e)=>(SetUserPass(e.target.value))}/>
                    <input type="submit" value="Submit" className="loginAdminSubmit"/>
                    <p>{isLoginMessage !== true ? "Username or Password is incorrect" : null}</p>
                </form>
            </div>  
        </>
    )
}
