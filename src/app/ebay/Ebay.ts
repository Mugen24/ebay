import { EbaySearch } from "../types/ebaySeachTypes"
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
}