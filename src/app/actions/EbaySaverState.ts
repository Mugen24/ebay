import { EbayApi } from "./ebayApi"
import { EbayGetItem } from "../types/ebayGetItemTypes"
import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes"
import { loadConfig, saveConfig } from "./actions/SaveState"
let ebay = await EbayApi.authenticate()

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
