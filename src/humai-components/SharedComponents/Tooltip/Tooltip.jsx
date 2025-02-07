import React from 'react';
import './Tooltip.css';

const Tooltip = ({ text, isVisible, alignment = 'right' }) => {
  if (!isVisible) return null;
  
  const alignmentStyle = {
    '--tooltip-right': alignment === 'right' ? '0px' : 'auto',
    '--tooltip-left': alignment === 'left' ? '0px' : 'auto',
    '--tooltip-transform': alignment === 'center' ? 'translateX(-50%)' : 'none',
    ...(alignment === 'center' && { '--tooltip-left': '50%' })
  };
  
  return (
    <div className="tooltip" style={alignmentStyle}>
      {text}
    </div>
  );
};

export default Tooltip;