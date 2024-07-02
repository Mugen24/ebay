import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn, ItemSummary } from "@/app/types/ebaySeachTypes";
import { EbayGetItemReturn, ebayGetItem } from "@/app/types/ebayGetItemTypes";
import { freemem } from "os";

export class Ebay {
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
                throw new Error(JSON.stringify(await res.toJSON()))
            }
        }
        this.axios.interceptors.response.use((res: AxiosResponse) => {
            return res
        }, responseErrorHandler)
    }

    static async initialise () {
        const ebayAuth = new EbayAuthToken(
            {
                clientId: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                redirectUri: process.env.REDIRECT_URI!,
            }
        )
        let token = await ebayAuth.getApplicationToken("PRODUCTION", Ebay.scopes)
        const parsed_token= JSON.parse(token);
        return new Ebay(parsed_token.access_token);
    }

    async search( options: EbaySearch): Promise<EbaySearchReturn> {
        const res = await this.axios.get("/buy/browse/v1/item_summary/search", {
            params: options
        })
        return res.data;
    }

    async getItem( options: ebayGetItem ): Promise<EbayGetItemReturn> {
        const res = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        return res.data
    }

    //fromDate instead of just Date.now() in case of checking  
    //date from the past
    static checkNewListing(item: ItemSummary, fromDate?: Date) {
        if (fromDate === undefined) {
            fromDate = new Date(Date.now())
        }
        fromDate.setHours(0)

        const itemDate = new Date(item.itemCreationDate);
        const minnuteOffset = itemDate.getTimezoneOffset();

        //Offset the UTC time
        return (itemDate.getTime() + (minnuteOffset * 60) >= fromDate.getTime())
    }
}



