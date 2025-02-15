"use client"
import logging from "@/app/utils/logger";
import { log } from "console";
import { useEffect, useState } from "react";

type Days= number
type Hours = number
type Mins = number
type Secs = number
export type Timer = [Days, Hours, Mins, Secs]

function timeLeft(startDate: Date, endDate: Date): Timer {
    // Date can do arith but type doesn't support?
    const oneDay = 24 * 60 * 60 * 1000
    const oneHour = 60 * 60 * 1000
    const oneMin = 60 * 1000
    const oneSec = 1000
    const diffDate = Math.abs(endDate.valueOf() - startDate.valueOf())
    // logging.debug("Date: ", diffDate)

    const day = Math.floor(diffDate / oneDay)
    const hours= Math.floor((diffDate % oneDay) / oneHour)
    const mins = Math.floor((diffDate % oneDay % oneHour) / oneMin)
    const secs= ((diffDate % oneDay % oneHour % oneMin) / oneSec)
    return [day, hours, mins, secs]

}
export function Timer({startDate, endDate}: {startDate: Date, endDate: Date}){

    const [timer, setTime] = useState<Timer>(() => timeLeft(startDate, endDate)) 
    // logging.debug("Date: ", diffDate)
    useEffect(() => {
        if (!startDate && !endDate) {
            return 
        } else {
            const interval = setInterval(() => {
                setTime(timeLeft(new Date(), endDate))
            }, 1000);
            return () => clearInterval(interval)
        }
    }, [startDate, timer, endDate])

    if (!startDate.valueOf() || !endDate.valueOf()) {
        return <></>
    }
    return (
        <>
            <p>{endDate.toLocaleString()}</p>
            <p>{timer[0]} D: {timer[1]} H: {timer[2]} Mins: {timer[3]} Secs</p>
        </>
    )
}