import { EbayItemSummary } from "./EbayApiScrapper";
import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes";

export interface EbayApiInterface {
    search: (ebaySearch: EbaySearch) => EbaySearchReturn
    getLowestHistoricalPrice: (searchTerm: string, minPrice: number) => EbayItemSummary
}