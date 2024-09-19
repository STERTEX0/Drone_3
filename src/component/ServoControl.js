import React, { useState } from "react";
import { useWebSocket } from "../context/WebSocketContext";
import "./ServoControl.css";
import GridOverlay from "./GridOverlay"; // นำเข้า GridOverlay คอมโพเนนต์

const ServoControl = () => {
  const { ws } = useWebSocket();
  const [intervalId, setIntervalId] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false); // เก็บสถานะของกล้อง
  const [isGridVisible, setIsGridVisible] = useState(false); // เก็บสถานะของการแสดง Grid

  const sendCommand = (command) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(command);
    } else {
      console.error("WebSocket is not open or not available");
    }
  };

  const handleMouseDown = (command) => {
    const id = setInterval(() => {
      sendCommand(command);
    }, 100); // ส่งคำสั่งทุก 100ms
    setIntervalId(id);
  };

  const handleMouseUp = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      sendCommand("offcamera"); // ปิดกล้อง
    } else {
      sendCommand("oncamera"); // เปิดกล้อง
    }
    setIsCameraOn((prevState) => !prevState); // สลับสถานะกล้อง
  };

  const toggleGrid = () => {
    setIsGridVisible((prevState) => !prevState); // สลับสถานะการแสดง Grid
  };

  const handleListServices = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send('listservice');
    } else {
      console.error('WebSocket is not open or available');
    }
  };

  return (
    <div className="servo-container">
      {/* เรียกใช้ GridOverlay และส่ง isGridVisible เป็น prop */}
      <GridOverlay isVisible={isGridVisible} />

      <div className="control-buttons">
        <div className="direction-buttons">
          <button
            className="btn btn-primary"
            onMouseDown={() => handleMouseDown("up")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => sendCommand("up")}
          >
            ↑
          </button>
          <div className="horizontal-buttons">
            <button
              className="btn btn-secondary"
              onClick={() => sendCommand("center")}
            >
              ⬤
            </button>
          </div>
          <button
            className="btn btn-primary"
            onMouseDown={() => handleMouseDown("down")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => sendCommand("down")}
          >
            ↓
          </button>
        </div>
        <div className="extreme-buttons">
          <button
            className="btn btn-primary"
            onClick={() => sendCommand("upmax")}
          >
            เงย
          </button>
          <button
            className="btn btn-primary"
            onClick={() => sendCommand("downmax")}
          >
            ก้ม
          </button>
         
        </div>
        <div className="extreme-buttons">
          <button
            className="btn btn-primary"
            onClick={() => sendCommand("on")}
          >
            เปิด
          </button>
          <button
            className="btn btn-primary"
            onClick={() => sendCommand("off")}
          >
            ปิด
          </button>
        </div>
        
        <div className="extreme-buttons">
          <button className="btn btn-primary" onClick={toggleCamera}>
            {isCameraOn ? "ปิดกล้อง" : "เปิดกล้อง"}
          </button>
        </div>
        <div className="extreme-buttons">
          <button className="btn btn-primary" onClick={handleListServices}>เช็คเซอร์วิส</button>
        </div>
        <div className="extreme-buttons">
          {/* ปุ่มเปิด/ปิด Grid Overlay */}
          <button className="btn btn-primary" onClick={toggleGrid}>
            {isGridVisible ? "ปิด Grid" : "เปิด Grid"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServoControl;
