import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ToastMessage.css';

const ToastMessage = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <div className={`toast-message ${type}`}>
      {message}
    </div>,
    document.body
  );
};

export default ToastMessage; 