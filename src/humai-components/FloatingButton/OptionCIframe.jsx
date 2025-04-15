import React, { useEffect, useState } from "react";

import './OptionCIframe.css';
import BackButton from "../ButtonsTypes/BackButton";
import { fetchICSFile } from "../Calendar/parseICS";
import { SubmitButton } from "../ButtonsTypes/SubmitButton";
import { getConfig } from '@edx/frontend-platform';
// import { CALENDAR_URL } from "../../utils/constants";


const OptionCIframe = ({ onBack }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const { 
    HUMAI_CALENDAR_USE_BACKEND,
    HUMAI_CALENDAR_ENDPOINT,
    HUMAI_ICALENDAR_URL,
    HUMAI_BACKEND_API_KEY,
    HUMAI_EVENTS_CALENDAR_ID,
    DAYS_BEFORE_CALENDAR
  } = getConfig();
  
  // const DAYS_BEFORE_CALENDAR = 3;
  const daysSpan = new Date();
  daysSpan.setDate(daysSpan.getDate() - DAYS_BEFORE_CALENDAR);

  
  const formatGCalendarDate = (date) => {
    return new Date(date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getAddGCalendarUrl = (event) => `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.summary || 'Event'
  )}&dates=${formatGCalendarDate(event.start)}/${formatGCalendarDate(
    event.end
  )}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(
    event.location || ''
  )}`;

  const loadEvents = async (url) => {
    try {
      const calendarEvents = await fetchICSFile(url);
      const validCalendarEvents = calendarEvents.filter((event) => event.start > daysSpan);
      validCalendarEvents.sort((a, b) => a.start - b.start);
      setEvents(validCalendarEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGcalendarEvents = async (url) => {
    try {
      const response = await fetch(`${url}/gcloud/calendar_events?calendar_id=${HUMAI_EVENTS_CALENDAR_ID}`, {
        headers: {
          Authorization: `Bearer ${HUMAI_BACKEND_API_KEY}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setEvents(data.map((event) => ({uid: event.id, ...event})));
    } catch (error) {
      console.error('Error fetching Google Calendar events:', error);
    }
  };

  useEffect(() => {
    if (HUMAI_CALENDAR_USE_BACKEND) {
      fetchGcalendarEvents(HUMAI_CALENDAR_ENDPOINT);
    } else {
      loadEvents(HUMAI_ICALENDAR_URL);
    }
  }, []);

  return (
    <div className="option-c-iframe">
      {loading ? (
        <p>Loading calendar events...</p>
      ) : (
        <div className="calendar-events">
          {events.length === 0 ? 
          <div className="calendar-event">
            <h3>No hay eventos disponibles</h3>
          </div>
          :
          <>
            {events.map((event, index) => (
              <div key={event.uid + "_" + index} className="calendar-event">
                <h3 className="event-summary">{event.summary || "Sin título"}</h3>
                <p className="event-time">
                  <strong>Inicio:</strong> {event.start?.toLocaleString("es-ES", {year: 'numeric', month: 'numeric', day: 'numeric'})}
                  <br />
                  <strong>Finalización:</strong> {event.end?.toLocaleString("es-ES", {year: 'numeric', month: 'numeric', day: 'numeric'})}
                </p>
                {event.location && 
                  <p className="event-location">
                    <strong>Ubicación:</strong> {event.location}
                  </p>
                }
                <p className="event-description">
                  <strong>Descripción:</strong>
                  <br />
                  {event.description 
                  ? 
                  event.description.split("\n").map((line, index) => (
                    <span key={index}>
                      {line.includes("http") ? (
                        <>
                        {line.split(urlRegex).map((part, i) =>
                          urlRegex.test(part) ? (
                            <a key={i} href={part} target="_blank" rel="noreferrer">
                              {part}
                            </a>
                          ) : (
                            <span key={i}>{part}</span>
                          ))
                        }
                        </>
                      ) : (
                        line
                      )}
                      <br />
                    </span>
                  ))
                  : "No disponible"
                  }
                </p>
                
                <div className="button-container">
                  <SubmitButton 
                    handleSubmit={() => window.open(getAddGCalendarUrl(event), '_blank')}
                    aria-label="Agregar a Google Calendar"
                    aria-data-url={getAddGCalendarUrl(event)}
                    text="Agregar a Google Calendar"
                  />

                </div>
              </div>
            ))}
          </>
          } 
        </div>
      )}
      <div className="button-container">
        <BackButton onClick={onBack} />
      </div>
    </div>
  );
};

export default OptionCIframe;