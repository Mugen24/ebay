import { EbayGetItem } from "../types/ebayGetItemTypes";
import { EbaySearch } from "../types/ebaySeachTypes";
import { EbayApi } from "./ebayApi"

const ebayApi = await EbayApi.authenticate();
export class EbayApiWrapper {
    static search(params: EbaySearch) {
        return ebayApi.search(params)
    }

    static getItem(params: EbayGetItem) {
        return ebayApi.getItem(params)
    }
}
