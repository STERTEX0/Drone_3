import React from "react";
import RssiLevel from "./component/RssiLevel";
import ServoControl from "./component/ServoControl";
import { WebSocketProvider } from "./context/WebSocketContext";
import Log from "./component/Log";
import VdoFeed from './component/VdoFeed';
import "./App.css";
// import Battery from "./component/Battery";
import StatusCard from "./component/StatusCard";
// import MapComponent from "./component/MapComponent";
import ServiceStatus from './component/ServiceStatus';  // Import the new component
import GridOverlay from './component/GridOverlay';

function App() {
  return (
    <WebSocketProvider>
      <div className="app-container">
        <div className="main-content">
          <ServoControl />
          <RssiLevel />
          <Log />
          {/* <Battery /> */}
          <VdoFeed />
          <StatusCard />
          {/* <MapComponent /> */}
          <ServiceStatus />
          <GridOverlay /> 
        </div>
      </div>
    </WebSocketProvider>
  );
}

export default App;
