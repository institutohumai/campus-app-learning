import { useEffect, useState, useRef } from 'react'

import { useRouter } from 'next/router'
import moment from 'moment-timezone'
import { minScheduleHours, warningText } from '../../config/minScheduleHours'
import { useQuery } from '../../hooks/useQuery'
import { useTranslation } from '../TranslationContext/TranslationContext'
import { disabledMatrix } from '../../lib/disabledMatrix'
import { ScheduleForm } from '../Schedule/ScheduleForm'
import { CooparteFormContainer } from './CooparteFormContainer'
import { ScheduleSuccess } from '../Schedule/ScheduleSuccess'
import { ScheduleFormBienvenida } from '../Schedule/ScheduleFormBienvenida'

function App() {
    const router = useRouter()
    const { translateDOM } = useTranslation()

    const [email, setEmail] = useState('')
    const [reason, setReason] = useState('')
    const [isBienvenida, setIsBienvenida] = useState(false)
    const [schedule, setSchedule] = useState([])
    const [scheduleKey, setScheduleKey] = useState(Date.now())
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [showEmail, setShowEmail] = useState(true)
    const [consultas, setConsultas] = useState('')
    const [showConsultas, setShowConsultas] = useState(true)
    const [showReason, setShowReason] = useState(true)
    const [timezone, setTimezone] = useState(moment.tz.guess())
    const [showWarning, setShowWarning] = useState(false)
    const [isDisabledMatrixApplied, setIsDisabledMatrixApplied] =
        useState(false)

    const scheduleRef = useRef(schedule)

    const scheduleDict = {
        '0': [],
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
    }

    useEffect(() => {
        const {
            e: emailParam,
            r: reasonParam,
            isBienvenida: isBienvenidaParam,
        } = router.query

        if (emailParam) {
            setEmail(Array.isArray(emailParam) ? emailParam[0] : emailParam)
            setShowEmail(false)
        }

        if (reasonParam) {
            setReason(Array.isArray(reasonParam) ? reasonParam[0] : reasonParam)
            setShowReason(false)
        }

        if (isBienvenidaParam) {
            setIsBienvenida(true)
        }

        const consultasParam = router.query.c
        if (consultasParam === '0') {
            setShowConsultas(false)
        }

        const tzParam = router.query.tz
        if (tzParam) {
            setTimezone(Array.isArray(tzParam) ? tzParam[0] : tzParam)
        }
    }, [router.query])

    useEffect(() => {
        applyDisabledMatrix()
    }, [])

    const applyDisabledMatrix = () => {
        disabledMatrix.forEach((hour, hourIndex) => {
            hour.forEach((cell, cellIndex) => {
                if (cell === -1) {
                    const rowSelector = hourIndex + 2
                    const cellSelector = cellIndex + 2

                    const gridCell = document.querySelector(
                        `.ScheduleSelector__Grid-sc-10qe3m2-1 > div:nth-child(${cellSelector}) > div:nth-child(${rowSelector})`,
                    )

                    if (gridCell && gridCell instanceof HTMLElement) {
                        gridCell.style.pointerEvents = 'none'
                        const onlyChild = gridCell.querySelector(':only-child')

                        if (onlyChild && onlyChild instanceof HTMLElement) {
                            onlyChild.style.backgroundColor = 'grey'
                        }
                    }
                }
            })
        })
        setIsDisabledMatrixApplied(true)
    }

    const isCellDisabled = date => {
        const day = date.getDay() // 0 (Sunday) to 6 (Saturday)
        let hourIndex = date.getHours() * 2 + (date.getMinutes() === 30 ? 1 : 0)
        hourIndex -= 16

        if (hourIndex >= disabledMatrix.length) {
            console.error('Hour index out of bounds:', hourIndex)
            return false
        }

        return disabledMatrix[hourIndex][day] === -1
    }

    const {
        isLoading: isLoadingUser,
        data: user,
        refetch: refetchUser,
    } = useQuery({
        url: `/api/users/user?userEmail=${email}`,
        method: 'GET',
    })

    useEffect(() => {
        if (isSuccess && isBienvenida) {
            window.parent.postMessage('iframeFormSuccess', '*')
        }
        if (isSuccess && !isBienvenida) {
            setShowEmail(false)
            setShowConsultas(false)
            setShowReason(false)
        }
    }, [isSuccess])

    useEffect(() => {
        if (isError) {
            window.parent.postMessage('iframeFormError', '*')
        }
    }, [isError])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('message', event => {
                if (event.data.action === 'submit') {
                    const emailFromParent = event?.data?.email
                    handleSubmit(event, email || emailFromParent)
                }
            })
        }
    }, [])

    useEffect(() => {
        if (isDisabledMatrixApplied) {
            scheduleRef.current = schedule
            setScheduleKey(Date.now())
            setTimeout(applyDisabledMatrix, 1)
        }
    }, [schedule, isDisabledMatrixApplied])

    useEffect(() => {
        if (email && !showEmail) {
            refetchUser()
        }
    }, [email])

    useEffect(() => {
        if (user) {
            setSchedule(transformScheduleDictToFormattedDates(user.schedule))
            setTimezone(user.timezone)
        }
    }, [user])

    useEffect(() => {
        translateDOM()
    }, [translateDOM])

    const sendData = async data => {
        setIsLoading(true)
        try {
            const response = await fetch('/api/writeData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, nodeName: 'cooparteInput' }),
            })

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            setIsSuccess(true)
            window.parent.postMessage('iframeFormSuccess', '*')
        } catch (error) {
            setIsError(true)
            window.parent.postMessage(
                { action: 'iframeFormError', message: error.message },
                '*',
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleFormChange = e => {
        if (e.target.name === 'email') setEmail(e.target.value)
        if (e.target.name === 'reason') setReason(e.target.value)
        if (e.target.name === 'consultas') setConsultas(e.target.value)
    }

    const formatDates = scheduleRef => {
        const updatedSchedule = [...scheduleRef.current]
        const withoutDuplicates = filterDuplicateDates(updatedSchedule).map(
            date => new Date(date),
        )
        const withoutDisabled = withoutDuplicates.filter(
            date => !isCellDisabled(date),
        )

        return withoutDisabled
    }

    const handleSubmit = async (event, parentEmail?: string) => {
        event.preventDefault()

        const formattedDates = formatDates(scheduleRef)
        const withoutWeekends = filterOutWeekends(formattedDates)

        const isDisabled = withoutWeekends.length < minScheduleHours * 2
        if (isDisabled) {
            window.parent.postMessage(
                { action: 'iframeFormError', message: warningText },

                '*',
            )
            return setShowWarning(true)
        } else {
            setShowWarning(false)
        }

        formattedDates.forEach(date => {
            const day = date.getDay().toString()
            const timeSlot = date.getHours() * 2 + date.getMinutes() / 30
            if (!scheduleDict[day].includes(timeSlot)) {
                scheduleDict[day].push(timeSlot)
            }
        })

        Object.keys(scheduleDict).forEach(day => {
            scheduleDict[day].sort((a, b) => a - b)
        })
        const formData = {
            email: parentEmail || email,
            reason,
            consultas,
            schedule: scheduleDict,
            date: Date.now(),
            timezone: timezone,
        }
        await sendData(formData)
    }

    const filterOutWeekends = dates => {
        return dates?.filter(dateString => {
            const date = new Date(dateString)
            const dayOfWeek = date.getDay()
            return dayOfWeek !== 5 && dayOfWeek !== 6
        })
    }

    function transformScheduleDictToFormattedDates(scheduleDict: {
        [key: string]: number[]
    }): string[] {
        if (!scheduleDict) {
            return null
        }
        const result: string[] = []
        const referenceDate = '2023-11-06'

        const baseDate = new Date(referenceDate)

        Object.keys(scheduleDict).forEach(day => {
            const dayIndex = parseInt(day, 10)
            scheduleDict[day]?.forEach(timeSlot => {
                const date = new Date(baseDate)
                date.setDate(baseDate.getDate() + dayIndex - baseDate.getDay())

                const hours = Math.floor(timeSlot / 2)
                const minutes = (timeSlot % 2) * 30

                date.setHours(hours, minutes, 0, 0)

                const formattedDate = date.toISOString()
                result.push(formattedDate)
            })
        })

        return result
    }

    function filterDuplicateDates(dates) {
        const uniqueDates = new Set()
        const filteredDates = []

        dates.forEach(date => {
            const formattedDate = new Date(date).toISOString()
            if (!uniqueDates.has(formattedDate)) {
                uniqueDates.add(formattedDate)
                filteredDates.push(formattedDate)
            }
        })

        return filteredDates
    }

    if (isBienvenida) {
        return (
            <CooparteFormContainer isBienvenida>
                <ScheduleFormBienvenida
                    handleSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    showReason={showReason}
                    reason={reason}
                    setTimezone={setTimezone}
                    showConsultas={showConsultas}
                    timezone={timezone}
                    consultas={consultas}
                    schedule={schedule}
                    scheduleKey={scheduleKey}
                    setSchedule={setSchedule}
                />
            </CooparteFormContainer>
        )
    }

    return (
        <CooparteFormContainer isBienvenida={false}>
            {isSuccess ? (
                <ScheduleSuccess />
            ) : (
                <ScheduleForm
                    handleSubmit={handleSubmit}
                    showEmail={showEmail}
                    email={email}
                    handleFormChange={handleFormChange}
                    showReason={showReason}
                    reason={reason}
                    setTimezone={setTimezone}
                    showConsultas={showConsultas}
                    timezone={timezone}
                    showWarning={showWarning}
                    consultas={consultas}
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    schedule={schedule}
                    scheduleKey={scheduleKey}
                    isError={isError}
                    setSchedule={setSchedule}
                />
            )}
        </CooparteFormContainer>
    )
}

export default App
