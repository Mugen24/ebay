import { Countries, SEbaySearch } from "../EbayApi/EbaySaverState"

export interface ItemNumber {
    ebayItemNumber: number,
    expiredDate: EpochTimeStamp
}
export interface Favourite {
    // Required the parsed version of ebaySearch using EbaySaverState
    // To favourite category instead of a particular keyword provide just the category_id
    state: SEbaySearch,
    readEbayItemNumbers: ItemNumber[],
}

export type Theme = "light" | "dark"
export interface SettingType {
    theme?: Theme,
    favourites?: Record<EpochTimeStamp, Favourite>
    // ItemNumber expiredDate should be expiresOffset + readDate
    expiresOffset?: number,
    shippingLocation?: keyof typeof Countries,
    shippingPostcode?: number
    itemLocation?: keyof typeof Countries
}