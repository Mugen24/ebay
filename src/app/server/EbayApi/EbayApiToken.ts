import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { EbayGetItemReturn, EbayGetItem } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import logging from "../../utils/logger";
import { Outcome } from "../../types/Outcome";
import { OptionalDataType } from "../../types/clientApiTypes";
import { GetCategoryTreeRequest, GetCategoryTreeResponse, GetDefaultCategoryTreeRequest, GetDefaultCategoryTreeResponse } from "../../types/EbayApiTypes/CategoryTree";

export class EbayApiToken {
    static scopes = ["https://api.ebay.com/oauth/api_scope"];
    token: string;
    axios: AxiosInstance;
    private constructor (token: string) {
        this.token = token;
        this.axios = axios.create({
            baseURL: "https://api.ebay.com",
            headers: {
                "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=AU,zip=2166",
                "X-EBAY-C-MARKETPLACE-ID": "EBAY_AU",
                "Authorization": `Bearer ${this.token}`
            }
        })
        async function responseErrorHandler(res: AxiosResponse) {
            if (res.status != 200) {
                logging.group("Ebay api error")
                logging.error("Request: ")
                logging.error(res.headers)
                // logging.error(res.request)

                logging.error("Response")
                logging.error(res.status)
                // logging.error( res.response?.headers)
                logging.error(res.data?.errors ?? "")

                // logging.error(res)
                // throw new Error(JSON.stringify(await res.toJSON()))
                return [false, {}]
            }
        }
        this.axios.interceptors.response.use((res: AxiosResponse) => {
            return res
        }, responseErrorHandler)
    }

    static async authenticate () {
        const ebayAuth = new EbayAuthToken(
            {
                clientId: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                redirectUri: process.env.REDIRECT_URI!,
            }
        )
        let token = await ebayAuth.getApplicationToken("PRODUCTION", EbayApiToken.scopes)
        const parsed_token= JSON.parse(token);
        return new EbayApiToken(parsed_token.access_token);
    }

    async search( config: EbaySearch | string , optionalConfig: Record<string,any> = {}): Promise<Outcome<EbaySearchReturn>> {
        let resp: AxiosResponse;
        //config is url returned by EbaySeachReturn[next]
        logging.group("Calling EbaySearch")
        logging.debug("Query: " + JSON.stringify(config))
        logging.debug("Optional config", optionalConfig)

        if (typeof config === "string") {
            resp = await this.axios.get(config, {
                headers: optionalConfig["headerParam"] ?? {}
            })
        }
        else {
            resp = await this.axios.get("/buy/browse/v1/item_summary/search", 
                {
                    params: config,
                    headers: optionalConfig["headerParam"] ?? {}
                }
            )
        }
        try {
            logging.debug("Item:", resp.data.itemSummaries[0])
        } catch {
            
        }

        logging.groupEnd()
        return [resp.status === 200, resp.data]
    }

    async getItem( options: EbayGetItem, optionalConfig?: OptionalDataType): Promise<Outcome<EbayGetItemReturn>> {
        const resp = await this.axios.get("/buy/browse/v1/item", {
            params: options
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


}

