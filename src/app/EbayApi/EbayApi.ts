import { EbayApi as EbayApiToken} from "./EbayApiToken";
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../types/ebaySeachTypes";

const ebayApiToken = await EbayApiToken.authenticate();
const ebayApiScrapper = await EbayApiScrapper.authenticate();

export async function topLevelAwaitWorkAround() {
    //TODO: Just get called in server component so that top level await works
}

export async function search(ebaySearch: EbaySearch) {
    return ebayApiToken.search(ebaySearch)
}

export async function getItemHistoricalLowest(searchTerm: string, minPrice: number) {
    return ebayApiScrapper.searchLowestSoldBetter(searchTerm, minPrice)
}
