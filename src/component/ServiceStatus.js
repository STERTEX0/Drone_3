import React, { useState, useEffect, useMemo } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import './ServiceStatus.css';

const ServiceStatus = () => {
  const { ws } = useWebSocket();
  const [services, setServices] = useState({});
  const [isCardVisible, setIsCardVisible] = useState(false); // Track visibility of the card, initially hidden

  // Memoize servicesToShow to ensure it's only initialized once
  const servicesToShow = useMemo(() => [
    "control-camera.service",
    "frontweb.service",
    "gps-battery.service",
    "websocket.service",
    "camera.service"
  ], []);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const message = event.data.replace(/^Message: /, '').replace(/'/g, '"');
        const isJSON = message.startsWith('{') && message.endsWith('}');
        if (isJSON) {
          const data = JSON.parse(message);

          const filteredServices = Object.keys(data)
            .filter(key => servicesToShow.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key];
              return obj;
            }, {});

          // Update and display the card only if filtered services are available
          if (Object.keys(filteredServices).length > 0) {
            setServices(filteredServices);
            setIsCardVisible(true); // Show the card when data is received
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', event.data, error);
      }
    };

    if (ws) {
      ws.addEventListener('message', handleMessage);
      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    }
  }, [ws, servicesToShow]);

  const handleCloseCard = () => {
    setIsCardVisible(false); // Hide the card when the close button is clicked
  };

  return (
    <>
      {isCardVisible && (
        <div className="service-status-card">
          <div className="service-card-header">
            <strong>Service Status</strong>
            <button className="btn-close-card" onClick={handleCloseCard}>
              &times;
            </button>
          </div>
          <div className="service-card-body">
            {Object.entries(services).map(([service, status]) => (
              <div className="service-info" key={service}>
                <div className={`status-indicator ${status === "Active and Running" ? "active" : "inactive"}`}></div>
                <strong>{service}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceStatus;
