import logging from "@/app/utils/logger"
import { clearInterval, setInterval } from "node:timers"

type EventData = {
    data: any,
    outcomes: Promise<any>[]
}

export abstract class EbayEvent {
    listeners: Record<string, (...args: any) => Promise<boolean>>
    intervalID: any
    // interval: number = 1800000 //30 mins
    // interval: number = 30 * 60 * 1000 //1 mins
    interval: number = 30000 //1 mins
    title: string
    

    constructor(eventTitle: string) {
        this.listeners = {}
        this.title = eventTitle
    }


    removeListener(title: string) {
        delete this.listeners[title]
    }


    stop() {
        clearInterval(this.intervalID)
    }

    async notify(data: any): Promise<void> {
        logging.group(this.title)

        const outcomes: Promise<any>[] = []
        
        for (const [title, callback] of Object.entries(this.listeners)) {
            logging.info("Calling:", title)
            outcomes.push(callback(data))
        }

        const results = await Promise.allSettled(outcomes)

        const eventData = {
            "data": data,
            "outcomes": outcomes
        }
        if (results.every(r => r.status === "fulfilled")) {
            this.onSuccess(eventData) 
        }
        else {
            this.onFailure(eventData) 
        }

        logging.groupEnd()
    }

    
    //NEEDS to be implemented on the children
    addListener(title: string, callback: (...args: any) => Promise<boolean>) {
        logging.info( "Listener added:", title)
        this.listeners[title] = callback
    }

    startLoop() {
        const loopFunc = this.mainLoop.bind(this)
        loopFunc()
        this.intervalID = setInterval(loopFunc, this.interval)
    }

    //Optional
    onSuccess(eventData: EventData) {
        logging.info("fulfilled")
    }
    onFailure(eventData: EventData) {
        logging.info("rejected")
        logging.info(eventData.outcomes)
        logging.info(JSON.stringify(eventData.data, ()=>{}, 4))
    }

    abstract mainLoop(): void
}
