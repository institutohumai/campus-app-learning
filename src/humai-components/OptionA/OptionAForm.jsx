import React, { useEffect, useState } from "react";
import "./OptionAForm.css";
import ClockButton from '../ButtonsTypes/ClockButton';
import BackButton from "../ButtonsTypes/BackButton";

import { OptionAFormContainer } from "./OptionAFormContainer";
import { SubmitButton } from "../ButtonsTypes/SubmitButton";
import { ScheduleContainer } from "../Schedule/ScheduleContainer";
import moment from 'moment-timezone';
import { getConfig } from '@edx/frontend-platform';

import { transformDatesToScheduleDict, transformScheduleDictToFormattedDates } from '../../utils/scheduleHelpers';

const OptionAForm = ({onBack, setShowToast, userEmail, courseCode}) => {
  const [query, setQuery] = useState("");
  const [showCalendar, setShowCalendar] = useState(true);
  const [schedule, setSchedule] = useState({});
  const [newSchedule, setNewSchedule] = useState([]);
  const [timezone, setTimezone] = useState(moment.tz.guess());
  const [showTooltip, setShowTooltip] = useState(false);
  
  const {
    HUMAI_HORARIOS_URL,
    HUMAI_COOPARTE_NODE_NAME,
    HUMAI_HORARIOS_TOOLTIP_TEXT,
    HUMAI_COOPARTE_POSTA_NODE_NAME,
    HUMAI_POSTA_ENABLE,
  } = getConfig();
  const handleToast = ({ message, type }) => {
    setShowToast(message, type);
  };


  const getUserCooparteData = async () => {
    try {
      const response = await fetch(`${HUMAI_HORARIOS_URL}/api/users/user?userEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json();
      // console.log("Data from Cooparte:", data);
      if (data?.timezone === undefined || data?.schedule === undefined) {
        setShowCalendar(true);
      } else {
        setSchedule(data?.schedule);
        setTimezone(data?.timezone);
        setNewSchedule(transformScheduleDictToFormattedDates(data?.schedule));
      }
    } catch (err) {
      console.error("Error getting user data from Cooparte:", err);
      setShowCalendar(true);
    }
  }

  const handleSubmit = () => {
    const sendCooparteQuery = async (data) => {
      try {
        const response = await fetch(`${HUMAI_HORARIOS_URL}/api/writeData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          setShowToast("No se pudo enviar el mensaje!", "error");
          throw new Error('Network response was not ok')
        }
        setShowToast("¡Consulta enviada con éxito!", "success");
        onBack();
        
      } catch (err) {
        setShowToast("No se pudo enviar el mensaje!", "error");
        console.error("Error sending query:", err);
      }
    }
    const data = {
      data: {
        consultas: query,
        email: userEmail,
        reason: courseCode,
        date: Math.floor(Date.now() / 1000),
        timezone: timezone,
        schedule: schedule
      },
      nodeName: HUMAI_COOPARTE_NODE_NAME
    }
    // console.log("Data to send:", data);
    sendCooparteQuery(data);
  };

  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  const handleBackClick = () => {
    if(showCalendar) {
      if (newSchedule.length > 0) {
        setSchedule(transformDatesToScheduleDict(newSchedule));
      }
      setShowCalendar(false);
    } else {
      onBack();
    }
  };

  const isScheduleEmpty = (schedule) => {
    const isObjectNotArray = typeof schedule === "object" && !Array.isArray(schedule);
    return isObjectNotArray && schedule !== null && Object.keys(schedule).length === 0;
  }

  const handleSendPosta = () => {
    
    const sendCoopartePosta = async () => {
      try {
        const data = {
          data: {
            email: userEmail,
            course: courseCode,
            schedule: schedule,
            timezone: timezone
          },
          nodeName: HUMAI_COOPARTE_POSTA_NODE_NAME
        }
        const response = await fetch(`${HUMAI_HORARIOS_URL}/api/stage/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        setShowToast("¡Solicitud de posta enviada!", "success");
        onBack();

      } catch (err) {
        console.error("Error sending posta:", err);
        setShowToast("No se pudo enviar la solicitud de posta!", "error");
      }
    }
    sendCoopartePosta();
  }

  useEffect(() => {
    getUserCooparteData();
  }, [])

  return (
    <>
    {showCalendar ?
      <OptionAFormContainer>
        <ScheduleContainer 
          handleBackClick={handleBackClick}
          userEmail={userEmail}
          courseCode={courseCode}
          onToast={handleToast}
          schedule={newSchedule}
          setSchedule={setNewSchedule}
          timezone={timezone}
          setTimezone={setTimezone}
          />
      </OptionAFormContainer>
      :
      <OptionAFormContainer>
      <div className="option-a-form">
        
          <div className="textarea-container">
            <textarea
              placeholder="Dejanos tu consulta acá..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              />
          </div>
    
        <div 
          className="button-container"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <BackButton onClick={handleBackClick} />
          <ClockButton
            onClick={handleCalendarClick}
            setOutsideToolTip={setShowTooltip}
          />
          <SubmitButton
            handleSubmit={handleSubmit}
            tooltipText={HUMAI_HORARIOS_TOOLTIP_TEXT}
            disabled={!query.trim() || isScheduleEmpty(schedule) || !timezone.trim()}
            showTooltip={showTooltip}
          />
          {(HUMAI_POSTA_ENABLE && courseCode?.length && courseCode.includes('lab')) &&
            <SubmitButton
            handleSubmit={handleSendPosta} 
            disabled={isScheduleEmpty(schedule) || !timezone.trim()}
            text="Solicitar posta"
            /> 
          }
        </div>
      </div>
    </OptionAFormContainer>
  }
  </>
  );
};

export default OptionAForm;
