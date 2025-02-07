import { useEffect } from 'react'
import ScheduleSelector from 'react-schedule-selector'
import './Schedule.css'
import { useTranslation } from './TranslationContext'

export const Schedule = ({setSchedule, schedule}) => {
    const { translateDOM } = useTranslation()
    
    const unselectedColor = 'rgba(187, 166, 207, 1)'
    const selectedColor = 'rgba(130, 98, 167, 1)'
    const hoveredColor = 'rgba(130, 98, 167, 0.8)'

    const startDate = new Date('2023-11-06')

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
                minTime={8}
                maxTime={23}
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