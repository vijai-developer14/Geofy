import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification({notifyStatus}){
    
     useEffect(()=>{
        if (notifyStatus) {
            toast(notifyStatus);
        }
    },[notifyStatus])
    return(
        <div>
            <ToastContainer />
        </div>
    )
}
export default Notification;