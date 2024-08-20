"use server"
import { EbayGetItem } from "../types/ebayGetItemTypes";
import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes";
import { EbayApi } from "./ebayApi"

const ebayApi = EbayApi.authenticate();
export async function search(params: EbaySearch) {
    return ebayApi.then((ebay) => {
        return ebay.search(params)
    })
}

export async function getItem(params: EbayGetItem) {
    return ebayApi.then((ebay) => {
        return ebay.getItem(params)
    })
}

