import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

function Routing({ agentLat, agentLng, propLat, propLng }) {
    let DefaultIcon = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    const map = useMap();

  useEffect(() => {
    if (!map || !propLat || !propLng) return;

 
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(agentLat, agentLng), 
        L.latLng(propLat, propLng)   
      ],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }]
      },
      addWaypoints: false, 
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false 
    }).addTo(map);

   
return () => {
       
        if (map && routingControl) {
            try {
                map.removeControl(routingControl);
            } catch (e) {
                console.warn("Routing cleanup failed", e);
            }
        }
    };
}, [map, agentLat, agentLng, propLat, propLng]);

  return null;
}

export default Routing;