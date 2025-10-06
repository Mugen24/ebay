import { clearInterval, setInterval } from "node:timers"

export abstract class EbayEvent<T> {
    listeners: Array<T>
    intervalID: any
    interval: number = 1800000 //30 mins
    static Instance: undefined | EbayEvent<T>

    constructor() {
        if (!!EbayEvent.Instance) {
            return EbayEvent.Instance
        } 

        EbayEvent.Instance = this
        this.listeners = []
    }


    removeListener(listener: T) {
        this.listeners = this.listeners.filter((sub) => {
            return (sub === listener) 
        })
    }

    addListener(listener: T) {
        this.listeners.push(listener)
    }

    stop() {
        clearInterval(this.intervalID)
    }

    startLoop() {
        const loopFunc = this.mainLoop.bind(this)
        loopFunc()
        this.intervalID = setInterval(loopFunc, this.interval)
    }

    abstract mainLoop(): void
    abstract notify(newItems: any): void
}
