import React from "react";
import "./OptionDContainer.css"; // Importa el archivo de estilos
import { getConfig } from '@edx/frontend-platform';

import BackButton from "../ButtonsTypes/BackButton";

const OptionDContainer = ({ onBack, setShowToast, userEmail }) => {

  const CAMPUS_TITO_API_KEY = getConfig().HUMAI_CAMPUS_TITO_API_KEY;

  useEffect(() => {

    const requestCloudStudioAccount = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "accept": "application/json",
          "access_token": CAMPUS_TITO_API_KEY
        }
        const cloud_studio_url = "";
        const response = await fetch(cloud_studio_url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            email: userEmail, 
          })
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const response_data =  await response.json();
        
        if(response_data["status"] === "success"){
          setShowToast("¡Solicitud de cuenta en Cloud Studio enviada!", "success");
          onBack(); 
        }

      } catch (error) {
        console.error("Error fetching invite data:", error);
      }
    };
    requestCloudStudioAccount();
  }, [onBack, userEmail]);

  return (
    <div className="option-d-iframe-container">
      {/* Botón de cierre */}
      {/* <button className="close-button" onClick={onBack}>
        ❌
      </button> */}
      <BackButton
        onClick={onBack}
        // className="close-button"
      />

      <div className="textarea-container">
        <p>Enviando solicitud a Cloud Studio...</p>
      </div>
      
    </div>
  );
};

export default OptionDContainer;
