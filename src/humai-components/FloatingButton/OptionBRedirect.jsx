import React, { useEffect } from "react";
// import { DISCORD_URL, CAMPUS_TITO_API_KEY } from "../../utils/constants";
import { getConfig } from '@edx/frontend-platform';

const OptionBRedirect = ({onBack, userEmail, courseCode, setShowToast}) => {
  const DISCORD_URL = getConfig().HUMAI_DISCORD_URL;
  const CAMPUS_TITO_API_KEY = getConfig().HUMAI_CAMPUS_TITO_API_KEY;

  useEffect(() => {
    const fetchTitoData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "accept": "application/json",
          "access_token": CAMPUS_TITO_API_KEY
        }
        const response = await fetch(`${DISCORD_URL}/create_invite`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            // email: userEmail, 
            code: courseCode
          })
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const invite_data =  await response.json();
        
        window.open(invite_data["url"], "_blank", "noopener,noreferrer");

      } catch (error) {
        console.error("Error fetching invite data:", error);
        setShowToast("Error al redirigir al canal de discord", "error");
      }
    };
    fetchTitoData();
    onBack();
  }, [onBack, userEmail, courseCode]);
  return <p>Redirigiendo al canal de discord...</p>;
};

export default OptionBRedirect;