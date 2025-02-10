import { EbaySearch, EbaySearchReturn } from "./EbayApiTypes/ebaySeachTypes";
import { EbayItemSummary } from "./EbayScraperTypes/ScraperTypes";


export interface EbayApiInterface {
    search: (ebaySearch: EbaySearch) => EbaySearchReturn
    getLowestHistoricalPrice: (searchTerm: string, minPrice: number) => EbayItemSummary
}