import React, { useState } from "react";
import OptionAForm from "../OptionA/OptionAForm";
import OptionBRedirect from "./OptionBRedirect";
import OptionCIframe from "./OptionCIframe";
import "./ModalOptions.css";

import ModalOption from "../ModalOptions/ModalOption";
import ToastMessage from "../SharedComponents/ToastMessage";



const ModalOptions = ({ userEmail, courseCode }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });

  const renderContent = () => {
    switch (selectedOption) {
      case "A":
        return (
          <OptionAForm 
            setShowToast={(message, type) => setShowToast({ show: true, message, type })} 
            onBack={() => setSelectedOption(null)}
            userEmail={userEmail}
            courseCode={courseCode}
          />
        );
      case "B":
        return <OptionBRedirect 
          userEmail={userEmail}
          courseCode={courseCode}
          onBack={() => setSelectedOption(null)}
        />;
      case "C":
        return <OptionCIframe onBack={() => setSelectedOption(null)}/>;
      default:
        return (
          <div>
            <h3>¿Cómo podemos ayudarte?</h3>
            <div className="options">
              <ModalOption 
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              }
              description="Cordiná una clase cooptimizada"
              info="Coordinamos tutorías en vivo con otros estudiantes, de manera automática, en base a tus consultas y horarios."
              onClick={() => setSelectedOption("A")}
            />
            <ModalOption 
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.175 13.175 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38z"/>
                </svg>
              }
              description="Dejá tu duda en discord"
              onClick={() => setSelectedOption("B")}
            />
            <ModalOption 
              icon={
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                </svg>
              }
              description="Conocé nuestros próximos eventos"
              onClick={() => setSelectedOption("C")}
            />
            </div>
              
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      {showToast.show && (
        <ToastMessage 
          message={showToast.message} 
          type={showToast.type}
          onClose={() => setShowToast({ show: false, message: '', type: 'success' })}
        />
      )}
    </>
  );
};

export default ModalOptions;
