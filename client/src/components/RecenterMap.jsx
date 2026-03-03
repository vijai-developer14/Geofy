import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";

export default function RecenterMap ({lat, long}){
    const map = useMap();
    useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100); 
  }, [map]);
    useEffect(()=>{
        if(lat && long){
            map.setView([lat, long], map.getZoom());
        }
    },[lat, long, map])

    return null;
} 