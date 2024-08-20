import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes"
import { saveConfig, loadConfig } from "./saveState"

export class EbaySaverState {
    data: EbaySearch
    tempData: EbaySearch

    constructor() {
        this.data = {}
        this.tempData = {}
    }
    
    saveState(searchState: EbaySearch) {
        this.data = searchState
    }

    toJson() {
        return Object.assign({}, this.data, this.tempData)
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
