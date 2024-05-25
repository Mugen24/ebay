import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosInstance } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/ebaySeachTypes";
import { Jim_Nightshade } from "next/font/google";
import { EbayGetItemReturn, ebayGetItem } from "@/app/types/ebayGetItemTypes";

class Ebay {
    static scopes = [];
    token: string;
    axios: AxiosInstance;
    private constructor (token: string) {
        this.token = token;
        this.axios = axios.create({
            baseURL: "https://api.ebay.com",
            headers: {
                "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=AU,zip=2166",
                "Authorization": `Bearer ${this.token}`
            }
        })
    }

    async initialise () {
        const ebayAuth = new EbayAuthToken(
            {
                clientId: process.env.CLIENT_ID!,
                clientSecret: process.env.CLIENT_SECRET!,
                redirectUri: process.env.REDIRECT_URI!,
            }
        )
        const token = await ebayAuth.getApplicationToken("PRODUCTION", Ebay.scopes)
        return new Ebay(token);
    }

    async search( options: EbaySearch): Promise<EbaySearchReturn> {
        const res = await this.axios.get("/buy/browse/v1/item_summary/search", {
            params: options
        })
        if (res.status != 200) {
            throw new Error(res.statusText);
        } else {
            return res.data;
        }
    }

    async getItem( options: ebayGetItem ): Promise<EbayGetItemReturn> {
        const res = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        if (res.status != 200) {
            throw new Error(res.statusText);
        } else {
            return res.data;
        }
    }

}



