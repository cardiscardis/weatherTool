import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, ScaleControl } from "react-leaflet";

//import "./styles.css";

const MERCATOR_TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const multiPolyline = [
    [
      [1000, 0],
      [0, 0],
      [-1000, 0],
    ],
    [
      [0, 1000],
      [0, 0],
      [0, -1000],
    ],
  ]

const Mercator = (props) => {
  const center = (Object.keys(props.locationData).length && props.locationData.latitude) ? [props.locationData.latitude, props.locationData.longitude] : [0,0];
  return (     
    <MapContainer
      style={{
        width: '100%',
        height: '100vh'
      }}
      center={center}
      zoom={2}
      minZoom={2}
    >
        <TileLayer url={MERCATOR_TILES_URL} attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
        <CircleMarker center={[0, 0]} pathOptions={{ color: 'red' }} radius={200}>
          <Popup>Popup in CircleMarker</Popup>
        </CircleMarker>
        <Polyline pathOptions={{ color: 'lime' }} positions={multiPolyline} />
        <ScaleControl imperial={false} position="topleft" />
    </MapContainer>    
  );
};

export default Mercator;
