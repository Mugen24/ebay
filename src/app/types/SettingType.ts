import { Countries, SEbaySearch } from "../EbayApi/EbaySaverState"
import { EbayGetItem, EbayGetItemReturn } from "./EbayApiTypes/ebayGetItemTypes";
import { EbaySearchReturn } from "./EbayApiTypes/ebaySeachTypes";
import { MarketplaceId } from "./marketplaceIds";

export interface ItemNumber {
    ebayItemNumber: number,
    expiredDate: EpochTimeStamp
}
export interface Favourite {
    // Required the parsed version of ebaySearch using EbaySaverState
    // To favourite category instead of a particular keyword provide just the category_id
    state: SEbaySearch,
    readEbayItemNumbers: ItemNumber[],
    refreshIntervalSecond: number
}

export type Theme = "light" | "dark"

// RESTful Item ID Format: v1|#|#
// For a single SKU listing, pass in the item ID:
// v1|2**********2|0
// For a multi-SKU listing, pass in the identifier of the variation:
// v1|1**********2|4**********2
export type EbayItemId= string;
export type WatchedItem = {
    itemData: EbayGetItem
    refreshIntervalSecond: number
}

export type WatchItems = Record<EbayItemId, WatchedItem>
export type FavouriteQueries = Record<EpochTimeStamp, Favourite>

export interface SettingType {
    theme?: Theme,
    favouriteQueries?: FavouriteQueries,
    watchedItems?: WatchItems
    // ItemNumber expiredDate should be expiresOffset + readDate
    shippingLocation?: keyof typeof Countries,
    shippingPostcode?: number
    // These two should give similar result?
    itemLocation?: keyof typeof Countries
    // Requires to fetch categories, it different per marketplace 
    marketPlaceId?: MarketplaceId

    defaultRefreshIntervalSecond?: number
}

export type FavouriteQueriesData = Record<EpochTimeStamp, EbaySearchReturn>
export type WatchItemsData = Record<EbayItemId, EbayGetItemReturn>