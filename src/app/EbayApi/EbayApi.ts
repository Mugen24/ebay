import { EbayApi as EbayApiToken} from "./EbayApiToken";
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../types/ebaySeachTypes";

const ebayApiToken: Promise<EbayApiToken> = EbayApiToken.authenticate()
const ebayApiScrapper: Promise<EbayApiScrapper> = EbayApiScrapper.authenticate()


export async function topLevelAwaitWorkAround() {
    //TODO: Just get called in server component so that top level await works
}

export async function search(ebaySearch: EbaySearch) {
    const ebayApi = await ebayApiToken;
    return ebayApi.search(ebaySearch)
}

export async function getItemHistoricalLowest(searchTerm: string, minPrice: number) {
    const ebayApi = await ebayApiScrapper;
    return ebayApi.searchLowestSoldBetter(searchTerm, minPrice)
}
