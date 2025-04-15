import { useEffect } from 'react'
import ScheduleSelector from 'react-schedule-selector'
import './Schedule.css'
import { useTranslation } from './TranslationContext'
// import { getConfig } from '@edx/frontend-platform';

export const Schedule = ({setSchedule, schedule}) => {
    const { translateDOM } = useTranslation()
    
    const unselectedColor = 'rgba(187, 166, 207, 1)'
    const selectedColor = 'rgba(130, 98, 167, 1)'
    const hoveredColor = 'rgba(130, 98, 167, 0.8)'

    const startDate = new Date('2023-11-06')
    const minTime = 8;
    const maxTime = 22;
    // const minTime = getConfig().HUMAI_COOPARTE_GRID_MIN_TIME;
    // const maxTime = getConfig().HUMAI_COOPARTE_GRID_MAX_TIME;

    useEffect(() => {
        translateDOM()
    }, [translateDOM])

    return (
        <div className='grid-container'>
            <ScheduleSelector
                selection={schedule}
                startDate={startDate}
                dateFormat="dddd"
                timeFormat="HH:mm"
                numDays={7}
                minTime={minTime}
                maxTime={maxTime}
                rowGap='1px'
                columnGap='1px'
                hourlyChunks={2}
                onChange={setSchedule}
                unselectedColor={unselectedColor}
                selectedColor={selectedColor}
                hoveredColor={hoveredColor}
                selectionScheme="square"
            />
        </div>
    )
}