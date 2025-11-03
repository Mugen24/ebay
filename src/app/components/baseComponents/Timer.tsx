"use client"
import { useEffect, useState } from "react";
import { DateDelta, TimeUtil } from "@/app/utils/time";


export function TimerComponent({startDate, endDate}: {startDate: Date, endDate: Date}){

    const [timer, setTime] = useState<DateDelta>(() => TimeUtil.timeLeft(startDate, endDate)) 
    // logging.debug("Date: ", diffDate)
    useEffect(() => {
        if (!startDate && !endDate) {
            return 
        } else {
            const interval = setInterval(() => {
                setTime(TimeUtil.timeLeft(new Date(), endDate))
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
            <p>{timer.getDate()}D {timer.getHours()}:{timer.getMinutes()}:{timer.getSeconds()}</p>
        </>
    )
}