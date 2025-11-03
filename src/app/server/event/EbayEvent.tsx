import logging from "@/app/utils/logger"
import { clearInterval, setInterval } from "node:timers"

export abstract class EbayEvent<ListenerType> {
    listeners: Array<ListenerType>
    intervalID: any
    // interval: number = 1800000 //30 mins
    interval: number = 30 * 60 * 1000 //1 mins
    

    constructor() {
        this.listeners = []
    }


    removeListener(listener: ListenerType) {
        this.listeners = this.listeners.filter((sub) => {
            return (sub === listener) 
        })
    }

    addListener(listener: ListenerType) {
        logging.debug( "Listener added:", listener.constructor.name)
        this.listeners.push(listener)
    }

    stop() {
        clearInterval(this.intervalID)
    }

    startLoop() {
        const classThis = this
        const loopFunc = this.mainLoop.bind(this)
        // Doesn't work event will never be fired 
        // the first time? because listeners will never be attached

        // function conditionalLoop() {
        //     if (classThis.listeners.length <= 0) {
        //         logging.debug(classThis.constructor.name, " has no listener")
        //         return
        //     }
        //     loopFunc()
        // }
        // conditionalLoop()

        loopFunc()
        this.intervalID = setInterval(loopFunc, this.interval)
    }

    abstract mainLoop(): void
    abstract notify(newItems: any): Promise<void>
}
