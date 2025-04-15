import React from "react";
import "./OptionDIframe.css"; // Importa el archivo de estilos

import { HORARIOS_URL } from "../../utils/constants";

const OptionDIframe = ({ onBack }) => {
  return (
    <div className="option-d-iframe-container">
      {/* Botón de cierre */}
      <button className="close-button" onClick={onBack}>
        ❌
      </button>

      {/* Iframe */}
      <iframe
        src={HORARIOS_URL}
        className="option-d-iframe"
        title="OptionDIframe"
      ></iframe>
    </div>
  );
};

export default OptionDIframe;
