import React from "react";
import "./ModalOption.css";
import InfoIcon from "../SharedComponents/InfoIcon";

const ModalOption = ({ icon, description, onClick, info }) => {
  return (
    <div className="modal-option" onClick={onClick}>
      {info && <InfoIcon tooltipText={info} size="small" />}
      <div className="modal-option-icon-container">
        {icon}
      </div>
      <div className="modal-option-content">
        <p className="modal-option-description">
          {description}
        </p>
      </div>
    </div>
  );
};

export default ModalOption;