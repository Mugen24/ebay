import { setTimeout } from "timers/promises";
import { search } from "../EbayApi/EbayApi";
import { saveConfig, loadConfig } from "./saveState";

async function sleep(second: number) {
    return new Promise((res) => setTimeout(second * 1000, res))
}

export class SearchListener {
    listeners: Array<(data: SearchListener) => void>
    constructor() {
        this.listeners = []
    }

    async start() {
        while (true) {
            const searchConfig = await loadConfig()

        }
    }


}