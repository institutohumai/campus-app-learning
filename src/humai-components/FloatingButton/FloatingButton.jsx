import React, { useState, useEffect } from "react";

import "./FloatingButton.css";
import ModalOptions from "./ModalOptions";
import Tooltip from "../SharedComponents/Tooltip/Tooltip";
import Modal from "../Modal/Modal";
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from "@edx/frontend-platform/auth";


const FloatingButton = () => {
  const [showTooltip, setShowTooltip] = useState(false); 
  const [showModal, setShowModal] = useState(false);
  const [courseCode, setCourseCode] = useState();
  const [isValidCourse, setIsValidCourse] = useState(false);
  
  const { email } = getAuthenticatedUser();
  // const email = "pablosgomez50@gmail.com";

  const handleOpenModal = () => setShowModal(true);

  const updateCourseCode = () => {
    // const configExcludedCourses = undefined;
    const configExcludedCourses = getConfig().HUMAI_EXCLUDED_COURSES;
    const parsedExcludedCourses = configExcludedCourses ? configExcludedCourses : [];
    const path = window.location.pathname;
    const regex = /\/course-v1:\w+\+(\w+)\+([\w.]+)/;
    const match = path.match(regex);
    const course_keyname = match ? match[1] : undefined;
    const course_code = match ? match[2] : undefined;
    if (course_code)
      setCourseCode(course_code);

    if (course_keyname && !parsedExcludedCourses.includes(course_keyname))
      setIsValidCourse(true);
  }
  
  

  useEffect(() => {
    updateCourseCode();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Lock scroll
    } else {
      document.body.style.overflow = 'auto'; // Unlock scroll
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  if (!isValidCourse) {
    return null;
  }

  return (
    <div className="floating-button-container">
      <Tooltip text={"Levantá la mano"} isVisible={showTooltip && !showModal} />
      <button
        className="floating-button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleOpenModal}
      >
        <span>🖐️</span>
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <ModalOptions
            courseCode={courseCode}
            userEmail={email}
          />
        </Modal>
      )}
    </div>
  );
};

export default FloatingButton;
