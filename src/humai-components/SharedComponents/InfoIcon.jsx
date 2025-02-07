import React, { useState } from "react";
import "./InfoIcon.css";
import Tooltip from "./Tooltip/Tooltip";

const InfoIcon = ({ tooltipText = "Esta es una información adicional", size = "medium" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="info-icon-container-relative">
      <Tooltip 
        alignment="center"
        isVisible={showTooltip} 
        text={tooltipText} 
      />
      <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)} >
        <div className={`info-icon ${size}`}>
          i
        </div>
      </div>
    </div>
  );
};

export default InfoIcon;
