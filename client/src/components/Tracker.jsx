import React, {useState, useEffect} from "react";
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import axios from "axios";
import RecenterMap from "./RecenterMap";
import Routing from "./Routing";
import Notification from  "./Notification";
import {BrowserRouter, Route, Routes, Link} from "react-router-dom";

function Tracker (){
    const [status, SetStatus] = useState("");
    const [propertyData, SetPropertyData] = useState([]);
    const [agentLocation, SetAgentLocation] = useState([]);
    const [propertyLat, SetPropertyLat]= useState(()=>{
        var lsProplat = localStorage.getItem("propLat");
        return lsProplat ? JSON.parse(lsProplat) : null
    });

    const [propertyLong, SetPropertyLong]= useState(()=>{
        var lsProplong = localStorage.getItem("propLong");
        return lsProplong ? JSON.parse(lsProplong) : null
    });

    const [propertyId, SetPropertyId] = useState(()=>{
        var lsPropId =  localStorage.getItem("propId");
        return lsPropId ? lsPropId : null
    });

    const [locStor, SetLocStor] = useState(()=>{
        var isBoolean =   localStorage.getItem("boolean");
        return isBoolean ? JSON.parse(isBoolean) : false
    });
    const [mapClose, SetMapClose] = useState(()=>{
        var isBoolean =   localStorage.getItem("boolean2");
        return isBoolean ? JSON.parse(isBoolean) : false
    });

    const [isMapActive, IsMapActive] = useState(()=>{
        var activeMap = localStorage.getItem("active_map")
        
        return activeMap ? JSON.parse(activeMap) : false
    })

    const sendLocationToServr =async (lng, lat)=>{
        await axios.post(`${process.env.REACT_APP_API_URL}/api/check-location`,{agentLng: lng, agentLat: lat,agentName: "Agent name",
            propertyid: propertyId})
        .then((result)=>{
            SetStatus(result.data.message);
            console.log(result)})
        .catch((err)=>{
            SetStatus("");
            console.log(err)});
    }
    
    useEffect(()=>{
        const watchId = navigator.geolocation.watchPosition(
            (position)=>{
                const {longitude, latitude} = position.coords;
                sendLocationToServr(longitude, latitude);
                SetAgentLocation([longitude, latitude])
        },
        (err)=>
            console.log(err),{enableHighAccuracy: true, maximumAge: 10000, timeout: 5000}
        );
        return ()=>navigator.geolocation.clearWatch(watchId)
    },[propertyId]);
    
    
    useEffect(()=>{
        axios.get(`${process.env.REACT_APP_API_URL}/api/properties`)
        .then((result)=>SetPropertyData(result.data))
        .catch(err=>SetPropertyData("Error while fectching data"))
    },[]);
    
    const startDirection = (lng, lat, propId)=>{
        if(propertyData.length > 0){
            SetPropertyLong(lng);
            SetPropertyLat(lat);
            SetPropertyId(propId);
            SetLocStor(true);
            SetMapClose(true)
            localStorage.setItem("boolean", JSON.stringify(true));
            localStorage.setItem("boolean2", JSON.stringify(true));
            localStorage.setItem("propId", JSON.stringify(propId));
            localStorage.setItem("propLong", JSON.stringify(lng));
            localStorage.setItem("propLat", JSON.stringify(lat));
            
            
        }
        else{return ;}   
    }

    const clearLocalStorage = ()=>{
        SetLocStor(false);
        SetMapClose(false);
        SetPropertyLat(null);
        SetPropertyLong(null);
        SetPropertyId(null);
        localStorage.removeItem("boolean");
        localStorage.removeItem("boolean2");
        localStorage.removeItem("propId");
        localStorage.removeItem("propLong");
        localStorage.removeItem("propLat");
    }



 
    return (
        <div>
            {/* <h1>{status}</h1> */}
            <header>
                <div className="container tracker_head_bg">
                    <img src="./images/geofy-logo.png" alt="" />
                    {/* <div>
                        <button>
                            Admin
                        </button>
                    </div> */}
                </div>
            </header>
            <div>
                <h1 className="prp_lst_ttle">Property List</h1>
            </div>
            <section className="container prop_list_bg">
            { propertyData.length > 0 ?
                propertyData.map((x)=>(
                    <div key={x._id} className="prop_list_box">
                        <p className="prop_name">{x.name}</p>
                        <p className="prop_type">{x.type}</p>
                        <p className="prop_loc"><i class="fas fa-map-marker-alt"></i>  {x.cityName}</p>
                        <button onClick={()=>startDirection(x.location.coordinates[0], x.location.coordinates[1], x._id)}>Start Direction</button>
                    </div>
                )): <p>Loading...</p>
            }
            </section>
            <p className="statusAgent">{status}</p>
            <div className="map_bg container">
                {mapClose?<button onClick={clearLocalStorage} className="closeButton">CLOSE</button>:null}
                { locStor ?
                agentLocation.length > 0 ?
                <MapContainer 
                    center={[agentLocation[1], agentLocation[0]]} 
                    zoom={15} 
                    style={{ height: "500px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap lat={agentLocation[1]} long={agentLocation[0]}/>

                    <Marker position={[agentLocation[1], agentLocation[0]]} />
                    {propertyLat && propertyLong && agentLocation.length > 0 && (
                        <Routing 
                            agentLat={agentLocation[1]} 
                            agentLng={agentLocation[0]} 
                            propLat={propertyLat} 
                            propLng={propertyLong} 
                        />
                        )}
                        {(propertyLat && propertyLong) &&
                        <Circle 
                        center={[
                            propertyLat, 
                                propertyLong 
                            ]} 
                        radius={50} 
                        pathOptions={{ 
                            color: 'red', 
                            fillColor: 'red', 
                            fillOpacity: 0.3 
                        }} 
                    >
                    </Circle> 
                    }
                    
                </MapContainer>: <p>Map Loading...</p>
                : null
                }
            </div>
            {/* <Notification notifyStatus = {status}/> */}

            {/* ========================= need to get current location lat and long */}

        </div>
    );
}
export default  Tracker;
