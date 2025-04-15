
import BackButton from "../ButtonsTypes/BackButton"
import { SubmitButton } from "../ButtonsTypes/SubmitButton";
import { Schedule } from './Schedule';
import ScheduleTimeZone from "./ScheduleTimeZone";
import TranslationProvider from "./TranslationContext";

export const ScheduleContainer = (props) => {
    // const {handleBackClick, userEmail, courseCode, onToast} = props;
    return (
        <TranslationProvider>
            <div className="schedule-container gap-4">
                <ScheduleTimeZone
                    timezone={props.timezone}
                    setTimezone={props.setTimezone}
                />
                <Schedule
                    setSchedule={props.setSchedule} 
                    schedule={props.schedule}
                />
            </div>
            <div className="button-container">
                <SubmitButton
                    handleSubmit={props.handleBackClick}
                    text="Avanzar a la consulta"
                    disabled={props.isDataInvalid}
                />
            </div>
        </TranslationProvider>
    )
}