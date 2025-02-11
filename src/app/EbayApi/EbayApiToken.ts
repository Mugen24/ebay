import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { EbayGetItemReturn, EbayGetItem } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import logging from "../utils/logger";
import { ShippingOption } from '../types/EbayApiTypes/ebaySeachTypes';

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
                console.log(res.response?.request)
                throw new Error(JSON.stringify(await res.toJSON()))
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

    async search( config: EbaySearch | string , optionalConfig: Record<string,any> = {}): Promise<EbaySearchReturn> {
        let res: AxiosResponse;
        //config is url returned by EbaySeachReturn[next]
        console.log("Calling Ebay Search: " + JSON.stringify(config))
        if (typeof config === "string") {
            res = await this.axios.get(config, {
                headers: optionalConfig["headerParam"] ?? {}
            })
        }
        else {
            res = await this.axios.get("/buy/browse/v1/item_summary/search", 
                {
                    params: config,
                    headers: optionalConfig["headerParam"] ?? {}
                }
            )
        }
        logging.debug("Optional config", optionalConfig)
        // logging.debug("Response:", res)
        // logging.debug("Item:", res.data.itemSummaries[0]?.shippingOptions[0]?.shippingCost)
        logging.debug("Item:", res.data.itemSummaries[0]?.shippingOptions)
        return res.data;
    }

    async getItem( options: EbayGetItem ): Promise<EbayGetItemReturn> {
        const res = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        return res.data
    }

}

