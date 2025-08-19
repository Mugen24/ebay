import { clearInterval, setInterval } from "node:timers"
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes"
const TIMER = 1000
// type UpdateEvent = (items: ItemSummary[]) => void

export class EbayEvent<T extends (...args: any[]) => void> {
    listeners: Array<T>
    intervalID: any
    constructor() {
        this.listeners = []
        this.intervalID = setInterval(this.eventLoop, TIMER)
    }
    addListener(listener: T) {
        this.listeners.push(listener)
    }

    async eventLoop() {
        throw new Error("Need to be implemented")
    }

    stop() {
        clearInterval(this.intervalID)
    }

    notify(...args: Parameters<T>) {
        this.listeners.forEach(l => l(...args))
    }
}