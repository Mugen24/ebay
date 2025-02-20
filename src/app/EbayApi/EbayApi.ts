import { EbayApi as EbayApiToken } from './EbayApiToken';
import { EbayScraper as EbayApiScrapper} from "./EbayApiScrapper";
import { EbaySearch } from "../types/EbayApiTypes/ebaySeachTypes";
import { OptionalDataType } from "../types/clientApiTypes";
import { EbayGetItem } from "../types/EbayApiTypes/ebayGetItemTypes";
import { GetCategoryTreeRequest, GetDefaultCategoryTreeRequest } from '../types/EbayApiTypes/CategoryTree';
import { Outcome } from '../types/Outcome';
import { Categories, categoryManager } from '../server/setting/categoryManager';
import logging from '../utils/logger';


class EbayApi {
    ebayApiToken?: EbayApiToken
    ebayApiScrapper?: EbayApiScrapper
    constructor(ebayApiToken?: EbayApiToken, ebayApiScrapper?: EbayApiScrapper) {
        this.ebayApiToken = ebayApiToken
        this.ebayApiScrapper = ebayApiScrapper
    }

    search(ebaySearch: EbaySearch, optionalConfig: OptionalDataType  = {}) {
        if (this.ebayApiToken) {
            return this.ebayApiToken.search(ebaySearch, optionalConfig)
        } else {
            logging.warn("EbayApiToken not loaded. Search will not work")
            return [false, {}]
        }
    }

    getItem(itemData: EbayGetItem, optionalConfig: OptionalDataType = {}) {
        if (this.ebayApiToken) {
            return this.ebayApiToken.getItem(itemData, optionalConfig)
        } else {
            logging.warn("EbayApiToken not loaded. getItem will not work")
            return [false, {}]
        }
    }


    getCategoryIds(request: GetDefaultCategoryTreeRequest): Outcome<Categories | undefined> {
        if (categoryManager && categoryManager.categories) {
            return [true, categoryManager.categories]
        } else {
            return [false, undefined]
        }
    }

    async getDefaultCategoryTree(request: GetDefaultCategoryTreeRequest) {
        if (this.ebayApiToken) {
            return await this.ebayApiToken.getDefaultCategoryTree(request)
        } else {
            return [false, {}] 
        }
    }

    async getCategoryTree(request: GetCategoryTreeRequest) {
        if (this.ebayApiToken) {
            return await this.ebayApiToken.getCategoryTree(request)
        }
        return [false, {}]
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
        // const ebayApiScrapper: Promise<EbayApiScrapper> = EbayApiScrapper.authenticate()
        // let ebayApiScrapper: EbayApiScrapper;
        return new EbayApi(ebayApiToken)
    }



}

export const ebayApi = await EbayApi.init()
