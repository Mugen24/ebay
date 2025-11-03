import { EbayApiToken } from './EbayApiToken';
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../../types/EbayApiTypes/ebaySeachTypes";
import { OptionalDataType } from "../../types/clientApiTypes";
import { EbayGetItem } from "../../types/EbayApiTypes/ebayGetItemTypes";
import { GetCategorySubtree, GetCategoryTreeRequest, GetDefaultCategoryTreeRequest } from '../../types/EbayApiTypes/CategoryTree';
import { Outcome } from '../../types/Outcome';
// import { Categories, categoryManager } from '../server/setting/categoryManager';
import logging from '../../utils/logger';
import { assert } from 'node:console';
import { Countries, SEbaySearch } from './EbaySaverState';


class EbayApi {
    ebayApiToken: EbayApiToken
    ebayApiScrapper?: EbayApiScrapper
    constructor(ebayApiToken: EbayApiToken, ebayApiScrapper?: EbayApiScrapper) {
        this.ebayApiToken = ebayApiToken
        this.ebayApiScrapper = ebayApiScrapper
    }

    search(ebaySearch: SEbaySearch, optionalConfig: OptionalDataType  = {}, noParse: Boolean = false) {
        return this.ebayApiToken.search(ebaySearch, optionalConfig, noParse)
    }

    getItem(itemData: EbayGetItem, optionalConfig: OptionalDataType = {}) {
        return this.ebayApiToken.getItem(itemData, optionalConfig)
    }

    setAddress(country: keyof typeof Countries, postcode: number) {
        return this.ebayApiToken.setAddress(country, postcode)
    }

    setMarketplaceID(marketCode: string) {
        return this.ebayApiToken.setMarketplaceID(marketCode)
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

    async getSubCategoryTree(request: GetCategorySubtree) {
        return await this.ebayApiToken.getSubCategoryTree({
            category_tree_id: request.category_tree_id,
            category_id: request.category_id 
        })
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
