import { useState } from 'react'
import moment from 'moment-timezone'

const ScheduleTimeZone = ({ setTimezone, timezone }) => {
    const mainTimezones = [
        {
            label: 'Argentina',
            value: 'America/Argentina/Buenos_Aires',
            flag: '🇦🇷',
        },
        { label: 'Mexico', value: 'America/Mexico_City', flag: '🇲🇽' },
        { label: 'Chile', value: 'America/Santiago', flag: '🇨🇱' },
        { label: 'Colombia', value: 'America/Bogota', flag: '🇨🇴' },
        { label: 'Venezuela', value: 'America/Caracas', flag: '🇻🇪' },
        { label: 'Ver todos', value: 'show_all' },
    ]

    const getTimezones = () => {
        const allTimezones = moment.tz.names()
        const southAmericanTimezones = allTimezones.filter(
            tz => tz.includes('America') && !tz.includes('North'),
        )
        const otherTimezones = allTimezones.filter(
            tz => !southAmericanTimezones.includes(tz),
        )
        return [...southAmericanTimezones, ...otherTimezones]
    }

    const handleClickTimezone = e => {
        if (e.target.value === 'show_all') {
            setShowAllTimezones(true)
        } else {
            setTimezone(e.target.value)
        }
    }

    const [showAllTimezones, setShowAllTimezones] = useState(false)

    return (
        <div
            className="flex flex-col gap-2 text-center w-80 form-item"
            id="reason-div">
            <label htmlFor="reason">Zona Horaria</label>

            <div className="flex flex-col gap-4">
                {showAllTimezones ? (
                    <select
                        className="bg-transparent"
                        id="timezone"
                        name="timezone"
                        required
                        value={timezone}
                        onChange={e => handleClickTimezone(e)}>
                        {getTimezones().map(tz => (
                            <option
                                className="text-black bg-white"
                                key={tz}
                                value={tz}>
                                {tz}
                            </option>
                        ))}
                    </select>
                ) : (
                    <select
                        className="bg-transparent"
                        id="timezone"
                        name="timezone"
                        required
                        value={timezone}
                        onChange={e => handleClickTimezone(e)}>
                        {mainTimezones.map(tz => (
                            <option
                                className="text-black bg-white"
                                key={tz.value}
                                value={tz.value}>
                                {tz.flag} {tz.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    )
}

export default ScheduleTimeZone
