'use client'
import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes"
import { saveConfig, loadConfig } from "./saveState"

type EbaySearchKey = keyof EbaySearch
export class EbaySaverState {
    data: EbaySearch
    tempData: EbaySearch

    constructor() {
        this.data = {}
        this.tempData = {}
    }
    
    saveState(searchState: EbaySearch) {
        this.data = JSON.parse(JSON.stringify(searchState))
    }


    toJson() {
        return Object.assign({}, this.data, this.tempData)
    }

    toSearchParams() {
        return new URLSearchParams(this.toJson() as Record<string, string>)
    }

    readCurrentState() {
        return this.data
    }

    saveToConfig() {
        saveConfig(this.data)
    }
    readConfig() {
        return loadConfig()
    }
}
