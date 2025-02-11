import { EbayApi as EbayApiToken} from "./EbayApiToken";
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../types/EbayApiTypes/ebaySeachTypes";

const ebayApiToken: Promise<EbayApiToken> = EbayApiToken.authenticate()
// const ebayApiScrapper: Promise<EbayApiScrapper> = EbayApiScrapper.authenticate()
let ebayApiScrapper: EbayApiScrapper;

async function loadScrapper(){
    if (!ebayApiScrapper) {
        const state = EbayApiScrapper.authenticate()
        if (state instanceof EbayApiScrapper) {
            ebayApiScrapper = state
        } else {
            return state            
        }
    } else return
}

export async function search(ebaySearch: EbaySearch, optionalConfig: Record<string, any> = {}) {
    const ebayApi = await ebayApiToken;
    return ebayApi.search(ebaySearch, optionalConfig)
}

export async function getItemHistoricalLowest(searchTerm: string, minPrice: number) {
    return ebayApiScrapper.searchLowestSoldBetter({
        keywords: searchTerm,
        sorting: "-avgsalesprice",
        minPrice: minPrice
    })
}
