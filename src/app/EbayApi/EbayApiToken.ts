import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { EbayGetItemReturn, EbayGetItem } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import logging from "../utils/logger";
import { ShippingOption } from '../types/EbayApiTypes/ebaySeachTypes';
import { error, log } from "console";
import { Outcome } from "../types/Outcome";
import { headers } from 'next/headers';
import { OptionalDataType } from "../types/clientApiTypes";
import { MarketplaceId } from "../types/marketplaceIds";
import { GetCategoryTreeRequest, GetCategoryTreeResponse, GetDefaultCategoryTreeRequest, GetDefaultCategoryTreeResponse } from "../types/EbayApiTypes/CategoryTree";

export class EbayApi {
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
        async function responseErrorHandler(res: AxiosError) {
            if (res.status != 200) {
                logging.group("Ebay api error")
                logging.error("Request: ")
                logging.error(res.request.headers)
                logging.error(res.request.body)

                logging.error("Response")
                logging.error( res.response?.status)
                // logging.error( res.response?.headers)
                logging.error( res.response?.data)
                // throw new Error(JSON.stringify(await res.toJSON()))
                return Response.json({}, {
                    status: 404,
                    statusText: "Ebay Error"
                })
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
        let token = await ebayAuth.getApplicationToken("PRODUCTION", EbayApi.scopes)
        const parsed_token= JSON.parse(token);
        return new EbayApi(parsed_token.access_token);
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
        logging.debug("Item:", resp.data.itemSummaries[0])
        logging.groupEnd()
        return [resp.status === 200, resp.data]
    }

    async getItem( options: EbayGetItem, optionalConfig: OptionalDataType): Promise<Outcome<EbayGetItemReturn>> {
        const resp = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        return [resp.status === 200, resp.data]
    }

    async getDefaultCategoryTree(request: GetDefaultCategoryTreeRequest, optionalConfig?: OptionalDataType): Promise<Outcome<GetDefaultCategoryTreeResponse>> {
        const path = "/commerce/taxonomy/v1/get_default_category_tree_id"
        const resp = await this.axios(
            path, {
                params: request
            }
        )
        return [resp.status === 200, resp.data]
    }

    async getCategoryTree(request: GetCategoryTreeRequest): Promise<Outcome<GetCategoryTreeResponse>> {
        const path = "/commerce/taxonomy/v1/category_tree/"
        const resp = await axios.get(
            path, {
                params: request
            }
        )
        return [resp.status === 200, resp.data]
    }


}

