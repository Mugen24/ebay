import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { EbayGetItemReturn, EbayGetItem } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import logging from "../../utils/logger";
import { Outcome } from "../../types/Outcome";
import { OptionalDataType } from "../../types/clientApiTypes";
import { GetCategorySubtree, GetCategorySubtreeResponse, GetCategoryTreeRequest, GetCategoryTreeResponse, GetDefaultCategoryTreeRequest, GetDefaultCategoryTreeResponse } from "../../types/EbayApiTypes/CategoryTree";
import { Countries, EbaySaverState, SEbaySearch } from './EbaySaverState';

const EBAY_MARKET = "EBAY_AU"
// Set user delivery fee to this address
const USER_COUNTRY = "AU"
const USER_ZIP = "2166"
// set default item location to australia
const ITEM_LOCATION = "AU"

const CATEGORY_ENDPOINT = "/commerce/taxonomy/v1/category_tree"

const LIMIT = 50

export class EbayApiToken {
    static scopes = ["https://api.ebay.com/oauth/api_scope"];
    token: string;
    axios: AxiosInstance;
    _optionalHeaders: Record<string, string>
    private constructor (token: string) {
        this.token = token;
        this._optionalHeaders= {}

        this.axios = axios.create({
            baseURL: "https://api.ebay.com",
            headers: {
                "X-EBAY-C-ENDUSERCTX": `contextualLocation=country=${USER_COUNTRY},zip=${USER_ZIP}`,
                "X-EBAY-C-MARKETPLACE-ID": `${EBAY_MARKET}`,
                "Authorization": `Bearer ${this.token}`
            }
        })

        this.axios.interceptors.request.use((request) => {
            request.headers = Object.assign(request.headers, this._optionalHeaders)
            return request
        })
        async function responseErrorHandler(res: AxiosResponse) {
            if (res.status != 200) {
                logging.group("Ebay api error")
                logging.error(JSON.parse(JSON.stringify(res)))
                return [false, {}]
            }
        }
        this.axios.interceptors.response.use((res: AxiosResponse) => {
            return res
        }, responseErrorHandler)
    }
    
    static async authenticate() {
        const ebayAuth = new EbayAuthToken(
            {
                clientId: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                redirectUri: process.env.REDIRECT_URI!,
            }
        )
        let token = await ebayAuth.getApplicationToken("PRODUCTION", EbayApiToken.scopes)

        const parsed_token= JSON.parse(token);
        if (process.env.ROLLUP_ENV === "DEBUG") {
            console.log(`TOKEN: ${parsed_token}`)
        }
        return new EbayApiToken(parsed_token.access_token);
    }

    async setAddress(country: keyof typeof Countries, postcode: number) {
        this._optionalHeaders["X-EBAY-C-ENDUSERCTX"] = `contextualLocation=${encodeURIComponent(`country=${country},zip=${postcode}`)}}`
    }

    async setMarketplaceID(marketCode: string) {
        // EBAY_AU
        this._optionalHeaders["X-EBAY-C-MARKETPLACE-ID"] = `${marketCode}`
    }

    async search(config: SEbaySearch, optionalConfig: Record<string,any> = {}): Promise<Outcome<EbaySearchReturn>> {
        //config is url returned by EbaySeachReturn[next]
        logging.group("Calling EbaySearch")
        // logging.debug("Query: " + JSON.stringify(config))
        // logging.debug("Optional config", optionalConfig)

        // set default item location to australia
        config.filter = config.filter ?? {}
        config.filter["itemLocationCountry"] = `${ITEM_LOCATION}`

        const ebaySearch = EbaySaverState.parse(config)
        const resp = await this.axios.get("/buy/browse/v1/item_summary/search", 
            {
                params: ebaySearch,
            }
        )
        const test: EbaySearchReturn = resp.data
        logging.groupEnd()
        return [resp.status === 200, resp.data]
    }

    async searchNext(config: SEbaySearch) {
        const limit = Number(config.limit) 
        const offset = Number(config.offset)

        const nextOffset = offset + limit

        config.offset = String(nextOffset)

        return this.search(config)
    }

    async searchPrevious(config: SEbaySearch) {
        const limit = Number(config.limit) 
        const offset = Number(config.offset)

        const prevOffset= offset - limit
        if (prevOffset >= 0) {
            config.offset = String(prevOffset)
            return this.search(config)
        }

        return [false, {
            error: "Cannot go back any further"
        }]
    }

    async getItem(options: EbayGetItem, optionalConfig?: OptionalDataType): Promise<Outcome<EbayGetItemReturn>> {
        const resp = await this.axios.get(`/buy/browse/v1/item/${options.item_id}`, {
            params: {
                fieldgroups: options.fieldgroups
            }
        })
        return [resp.status === 200, resp.data]
    }

    async getDefaultCategoryTree(request: GetDefaultCategoryTreeRequest, optionalConfig?: OptionalDataType): Promise<Outcome<GetDefaultCategoryTreeResponse>> {
        logging.group("Getting root tree")
        const path = "/commerce/taxonomy/v1/get_default_category_tree_id"
        const resp = await this.axios.get(
            path, {
                params: request
            }
        )
        logging.groupEnd()
        return [resp.status === 200, resp.data]
    }

    async getCategoryTree(request: GetCategoryTreeRequest): Promise<Outcome<GetCategoryTreeResponse>> {
        logging.group("Getting category tree")
        const path = "/commerce/taxonomy/v1/category_tree"
        const resp = await this.axios.get(`${path}/${request.category_tree_id}`)
        logging.debug("Resp: ", resp.data)
        logging.groupEnd()
        return [resp.status === 200, resp.data]
    }

    async getSubCategoryTree(data: GetCategorySubtree): Promise<Outcome<GetCategorySubtreeResponse>>{
        // TODO: generate return type
        const {category_id, category_tree_id} = data
        logging.group("Getting sub category tree")
        const path = CATEGORY_ENDPOINT + "/" + category_tree_id + "/get_category_subtree"
        const resp = await this.axios.get(`${path}?category_id=${category_id}`)

        logging.debug("Resp: ", resp.data)
        logging.groupEnd()

        return [resp.status === 200, resp.data]
    }
}

