import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, ScaleControl } from "react-leaflet";

const Mercator = (props) => {
  const MERCATOR_TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const center = Object.keys(props.locationData).length && props.locationData.Latitude ? [parseFloat(props.locationData.Latitude), parseFloat(props.locationData.Longitude)] : [0,0];
  const multiPolyline = [
    [
      [1000, center[1]],
      center,
      [-1000, center[1]],
    ],
    [
      [center[0], 1000],
      center,
      [center[0], -1000],
    ],
  ]

  
  return (     
    <MapContainer
      style={{
        width: '100%',
        height: '100vh'
      }}
      center={center}
      zoom={10}
      minZoom={2}
    >
        <TileLayer url={MERCATOR_TILES_URL} attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        <CircleMarker center={center} pathOptions={{ color: 'red' }} radius={200}>
          <Popup>Popup in CircleMarker</Popup>
        </CircleMarker>
        <Polyline pathOptions={{ color: 'lime' }} positions={multiPolyline} />
        <ScaleControl imperial={false} position="topleft" />
    </MapContainer>    
  );
};

export default Mercator;
