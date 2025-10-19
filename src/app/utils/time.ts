function relativeTime(sourceTime: Date) {
    const currentTime = new Date(Date.now())
    const diffTime = currentTime.getTime() - sourceTime.getTime() 

    const seconds = diffTime / 1000
    if (seconds < 60) {
        return `${Math.round(seconds)}s ago`
    }

    const minutes = seconds / 60
    if (minutes < 60) {
        return `${Math.round(minutes)}mins ago`
    }

    const hours = minutes / 60
    if (hours < 24) {
        return `${Math.round(minutes)}hrs ago`
    }

    const days = hours / 24
    return `${Math.round(days)} days ago`
}

