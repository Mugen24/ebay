export type DateDelta = Pick<Date, "getDate" | "getHours" | "getMinutes" | "getSeconds" | "getMilliseconds">
export class TimeUtil {
    static oneDay = 24 * 60 * 60 * 1000
    static oneHour = 60 * 60 * 1000
    static oneMin = 60 * 1000
    static oneSec = 1000

    static timeLeft(startDate: Date, endDate: Date): DateDelta{
        // Date can do arith but type doesn't support?
        const diffDate = Math.abs(endDate.valueOf() - startDate.valueOf())
        const days = Math.floor(diffDate / TimeUtil.oneDay)
        const hrs = Math.floor((diffDate % TimeUtil.oneDay) / TimeUtil.oneHour)
        const mins = Math.floor((diffDate % TimeUtil.oneDay % TimeUtil.oneHour) / TimeUtil.oneMin)
        const secs= ((diffDate % TimeUtil.oneDay % TimeUtil.oneHour % TimeUtil.oneMin) / TimeUtil.oneSec)
        return new Date(0, 0, days, hrs, mins, secs)
    }

    static convertToMilisecond(date: DateDelta) {
        const day = date.getDate() * TimeUtil.oneDay
        const hrs = date.getHours() * TimeUtil.oneHour
        const minutes = date.getMinutes() * TimeUtil.oneMin
        const miliseconds = date.getMilliseconds() * TimeUtil.oneSec
        return day + hrs + minutes + miliseconds
    }
}