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
  const [isValidCloudStudio, setIsValidCloudStudio] = useState(false);
  
  const { email } = getAuthenticatedUser();
  // const email = "pablosgomez50@gmail.com";

  const handleOpenModal = () => setShowModal(true);

  const extractCourseInfo = () => {
    const path = window.location.pathname;
    const regex = /\/course-v1:\w+\+(\w+)\+([\w.]+)/;
    const match = path.match(regex);
    const course_keyname = match ? match[1] : undefined;
    const course_code = match ? match[2] : undefined;
    return {
      course_keyname,
      course_code
    };
  }

  const updateCourseCode = () => {
    // const configExcludedCourses = undefined;
    const configExcludedCourses = getConfig().HUMAI_EXCLUDED_COURSES;
    const parsedExcludedCourses = configExcludedCourses ? configExcludedCourses : [];
    
    const { course_keyname, course_code } = extractCourseInfo();
    if (course_code)
      setCourseCode(course_code);

    if (course_keyname) {
      setIsValidCourse(!parsedExcludedCourses.includes(course_keyname));
      // setIsValidCloudStudio(course_keyname.toLowerCase().includes("iot"));
    }
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

  if (!getConfig().HUMAI_COOPARTE_ENABLE || !isValidCourse) {
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
            requestCloudStudio={isValidCloudStudio}
          />
        </Modal>
      )}
    </div>
  );
};

export default FloatingButton;
