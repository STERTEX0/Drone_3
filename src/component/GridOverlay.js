import React from 'react';
import './GridOverlay.css';

const GridOverlay = ({ isVisible }) => {
  return (
    <div className={`grid-overlay ${isVisible ? 'visible' : ''}`}>
      {/* กริด 9 ช่อง */}
      <div className="grid-container">
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
        <div className="grid-cell"></div> {/* กล่องกลาง */}
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
        <div className="grid-cell"></div>
      </div>

      {/* เส้นกากบาททแยงมุมโดยใช้ SVG */}
      <svg className="diagonal-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="100" y2="100" stroke="rgb(66, 66, 66)" strokeWidth="0.2"/>
        <line x1="100" y1="0" x2="0" y2="100" stroke="rgb(66, 66, 66)" strokeWidth="0.2"/>
      </svg>
    </div>
  );
};

export default GridOverlay;
