import React, { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import './Battery.css';

const Battery = () => {
  const { ws } = useWebSocket();
  const [batteryPercentage, setBatteryPercentage] = useState(100); // Default to 100%
  const [batteryCells, setBatteryCells] = useState([]); // To hold battery cell data
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // Track if the tooltip is visible
  const [totalVoltage, setTotalVoltage] = useState(0); // Default to 0
  const batteryRef = useRef(null); // Reference to the Battery component

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const message = event.data.replace(/^Message: /, "").replace(/'/g, '"');
        if (message.startsWith("{") && message.endsWith("}")) {
          const data = JSON.parse(message);

          // Ensure battery data exists before processing it
          if (data && data.battery) {
            setBatteryPercentage(data.total_voltage_percentage || "N/A");
            setBatteryCells(data.battery); // Update battery cells data
            setTotalVoltage(data.total_voltage || "N/A"); // Update total voltage
          } else {
            console.warn("No battery data found in message.");
          }
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    // Register the WebSocket listener if WebSocket exists
    if (ws) {
      ws.addEventListener('message', handleMessage);
    }

    // Clean up the listener on unmount
    return () => {
      if (ws) {
        ws.removeEventListener('message', handleMessage);
      }
    };
  }, [ws]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isTooltipVisible && batteryRef.current && !batteryRef.current.contains(event.target)) {
        setIsTooltipVisible(false); // Hide the tooltip when clicking outside
      }
    };

    if (isTooltipVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipVisible]);

  const toggleTooltip = () => {
    setIsTooltipVisible((prev) => !prev); // Toggle the tooltip visibility
  };

  return (
    <div className="battery-container">
      <span className="total-voltage">
        {totalVoltage !== null ? `${totalVoltage}V` : "N/A"}
      </span>
      <div
        className={`battery-icon ${batteryCells.some(cell => cell.percentage < 5) ? "battery-icon-warning" : ""}`}
        onClick={toggleTooltip} // Toggle tooltip visibility on click
        ref={batteryRef}
      >
        <div
          className="battery-level"
          style={{
            width: typeof batteryPercentage === "number" ? `${batteryPercentage}%` : "0%",
          }}
        ></div>
        {isTooltipVisible && (
          <div className="battery-tooltip">
            {batteryCells.length === 0 ? (
              <div>
                <div>Cell N/A: V: N/A (N/A%)</div>
              </div>
            ) : (
              batteryCells.map((cell) => (
                <div key={cell.cell} className="battery-tooltip-cell">
                  <div className="battery-cell-icon">
                    <div className="battery-cell-level" style={{ width: `${cell.percentage}%` }}>
                      {/* แถบแสดงแบตเตอรี่ของแต่ละ cell */}
                    </div>
                  </div>
                  <b>Cell</b> {cell.cell}: <b>V :</b> {cell.voltage.toFixed(2)}V ({cell.percentage}%)
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <span className="battery-percentage">
        {batteryPercentage !== null ? `${Math.floor(batteryPercentage)}%` : "N/A"}
      </span>
    </div>
  );
};

export default Battery;
