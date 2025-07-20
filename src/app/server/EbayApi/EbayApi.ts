import { EbayApiToken } from './EbayApiToken';
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../../types/EbayApiTypes/ebaySeachTypes";
import { OptionalDataType } from "../../types/clientApiTypes";
import { EbayGetItem } from "../../types/EbayApiTypes/ebayGetItemTypes";
import { GetCategoryTreeRequest, GetDefaultCategoryTreeRequest } from '../../types/EbayApiTypes/CategoryTree';
import { Outcome } from '../../types/Outcome';
// import { Categories, categoryManager } from '../server/setting/categoryManager';
import logging from '../../utils/logger';
import { assert } from 'node:console';


class EbayApi {
    ebayApiToken: EbayApiToken
    ebayApiScrapper?: EbayApiScrapper
    constructor(ebayApiToken: EbayApiToken, ebayApiScrapper?: EbayApiScrapper) {
        this.ebayApiToken = ebayApiToken
        this.ebayApiScrapper = ebayApiScrapper
    }

    search(ebaySearch: EbaySearch, optionalConfig: OptionalDataType  = {}) {
        return this.ebayApiToken.search(ebaySearch, optionalConfig)
    }

    getItem(itemData: EbayGetItem, optionalConfig: OptionalDataType = {}) {
        return this.ebayApiToken.getItem(itemData, optionalConfig)
    }


    //getCategoryIds(request: GetDefaultCategoryTreeRequest): Outcome<Categories | undefined> {
    //    if (categoryManager && categoryManager.categories) {
    //        return [true, categoryManager.categories]
    //    } else {
    //        return [false, undefined]
    //    }
    //}

    async getDefaultCategoryTree(request: GetDefaultCategoryTreeRequest) {
        return await this.ebayApiToken.getDefaultCategoryTree(request)
    }

    async getCategoryTree(request: GetCategoryTreeRequest) {
        return await this.ebayApiToken.getCategoryTree(request)
    }


    async getItemHistoricalLowest(searchTerm: string, minPrice: number) {
        return this.ebayApiScrapper?.searchLowestSoldBetter({
            keywords: searchTerm,
            sorting: "-avgsalesprice",
            minPrice: minPrice
        })
    }

    
    static async init() {
        const ebayApiToken: EbayApiToken = await EbayApiToken.authenticate()
        // Need this for now
        console.assert(ebayApiToken)

        return new EbayApi(ebayApiToken)
    }
}

export const ebayApi = await EbayApi.init()
