import { EbayApi as EbayApiToken, EbayApi } from './EbayApiToken';
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { Category, EbaySearch } from "../types/EbayApiTypes/ebaySeachTypes";
import { OptionalDataType } from "../types/clientApiTypes";
import { EbayGetItem } from "../types/EbayApiTypes/ebayGetItemTypes";
import { throws } from "node:assert";
import { GetDefaultCategoryTreeRequest } from '../types/EbayApiTypes/CategoryTree';
import { categoriesManager } from '../server/Init';
import { Outcome } from '../types/Outcome';
import { Categories } from '../server/setting/categoryManager';

export const ebayApiToken: Promise<EbayApiToken> = EbayApiToken.authenticate()
// const ebayApiScrapper: Promise<EbayApiScrapper> = EbayApiScrapper.authenticate()
export let ebayApiScrapper: EbayApiScrapper;

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

export async function search(ebaySearch: EbaySearch, optionalConfig: OptionalDataType  = {}) {
    const ebayApi = await ebayApiToken;
    return ebayApi.search(ebaySearch, optionalConfig)
}

export async function getItem(itemData: EbayGetItem, optionalConfig: OptionalDataType = {}) {
    const ebayApi = await ebayApiToken;
    return ebayApi.getItem(itemData, optionalConfig)
}


export function getCategoryIds(request: GetDefaultCategoryTreeRequest): Outcome<Categories | undefined> {
    if (categoriesManager && categoriesManager.categories) {
        return [true, categoriesManager.categories]
    } else {
        return [false, undefined]
    }
}

export async function getItemHistoricalLowest(searchTerm: string, minPrice: number) {
    return ebayApiScrapper.searchLowestSoldBetter({
        keywords: searchTerm,
        sorting: "-avgsalesprice",
        minPrice: minPrice
    })
}
