import React, { useState } from 'react';
import Tooltip from '../SharedComponents/Tooltip/Tooltip';

const ClockButton = ({ onClick, tooltipText = "Revisar mis horarios", setOutsideToolTip }) => {
const [showTooltip, setShowTooltip] = useState(false);

const handleOnEnter = () => {
  setShowTooltip(true);
  setOutsideToolTip(false);
}

const handleOnLeave = () => {
  setShowTooltip(false);
  setOutsideToolTip(true);
}
return (
  <div className="info-icon-container-relative">
    <Tooltip 
      alignment="center"
      isVisible={showTooltip} 
      text={tooltipText}
    />
    <div 
    onMouseEnter={handleOnEnter} 
    onMouseLeave={handleOnLeave}
    >
             <button 
           className="clock-button" 
           onClick={onClick}
         >
           <svg 
             width="24" 
             height="24" 
             viewBox="0 0 24 24" 
             fill="none" 
             xmlns="http:www.w3.org/2000/svg"
           >
             <path 
               d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round"
             />
             <path 
               d="M12 6V12L16 14" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round"
             />
           </svg>
         </button>
    </div>
  </div> )
};

export default ClockButton; 