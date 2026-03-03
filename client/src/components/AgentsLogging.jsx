import axios from "axios";
import React, { useState, useEffect } from "react";

function AgentsLogging (){
    const [agentLogs, SetAgentLogs] = useState([]);
    
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/logs`, {withCredentials:true})
        .then(response=>
            SetAgentLogs(response.data)
        )
        .catch(err=>console.log("There is an error while getting Agent log data"))
    },[]);
    return(    
        <div className='tabAgent'>
            <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Name</p>
                        { agentLogs.length > 0 ?
                        agentLogs.map((log)=>(
                            <div key={log._id}>
                               <p className='tabelCnt'>{log.agentName}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
            </div>
            <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Entry Time</p>
                        { agentLogs.length > 0 ?
                        agentLogs.map((log)=>(
                            <div key={log._id}>
                               <p className='tabelCnt'>{new Date(log.entryTime).toLocaleString()}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
            </div>
            <div className='tableHeading'>
                        <p className='tableHeadingTxt'>Exit Time</p>
                        { agentLogs.length > 0 ?
                        agentLogs.map((log)=>(
                            <div key={log._id}>
                               <p className='tabelCnt'>{log.exitTime ? new Date(log.exitTime).toLocaleString() : "still not exited the site"}</p>
                            </div>
                        )): <p>Loading...</p>
                    }
            </div>
            
        </div>
    )
}
export default AgentsLogging;
