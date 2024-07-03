import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn, ItemSummary } from "@/app/types/ebaySeachTypes";
import { EbayGetItemReturn, ebayGetItem } from "@/app/types/ebayGetItemTypes";
import { freemem } from "os";
import config from "../../data/searchConfig.json"
import { URLSearchParamsToJson } from "@/app/utils";

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

    static async authenticate () {
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

    async search( config: EbaySearchConfig): Promise<EbaySearchReturn> {
        const res = await this.axios.get("/buy/browse/v1/item_summary/search", 
            {
                params: config.toJson()
            }
        )
        return res.data;
    }

    async getItem( options: ebayGetItem ): Promise<EbayGetItemReturn> {
        const res = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        return res.data
    }

}



export class _EbaySearchConfig {
    _data: EbaySearch
    _tempData: EbaySearch
    constructor (res: EbaySearch) {
        this._data = {
            q: res.q
        }

        this._tempData = Object.fromEntries(Object.entries(res).filter(([key]) => {
            return !(key in Object.keys(this._data))
        }))

    }

    addEntry <Key extends keyof EbaySearch> (key: Key, value: EbaySearch[Key]) {
        this._data[key] = value
    }
    addTempEntry <Key extends keyof EbaySearch> (key: Key, value: EbaySearch[Key]) {
        this._tempData[key] = value
    }
    flushTempEntries () {
        this._tempData = {}
    }
    toJson() {
        return Object.assign({}, this._data, this._tempData)
    }
}

export class EbaySearchConfig{
    searchConfig: _EbaySearchConfig | undefined
    constructor () {
        this.searchConfig = undefined
    }

    setParams (request: EbaySearch) {
        this.searchConfig = new _EbaySearchConfig(request)
    }

    addEntry (key: keyof EbaySearch, value: any) {
        this.searchConfig?.addEntry(key, value)
    }

    addTempEntry (key: keyof EbaySearch, value: any) {
        this.searchConfig?.addTempEntry(key, value)
    }

    flushTempEntry () {
        this.searchConfig?.flushTempEntries()
    }

    //Remove tempEntry after being called
    toJson () {
        if (this.searchConfig === undefined) {
            throw new Error("Item Params has not been set up")
        }
        //Add some default value
        if (this.searchConfig._data["filter"] === undefined) {
            this.searchConfig.addTempEntry("filter", "conditions:{USED|UNSPECIFIED}")
        } else {
            this.searchConfig.addTempEntry("filter", this.searchConfig._data["filter"]+",conditions:{USED|UNSPECIFIED}")
        }
        const data = this.searchConfig?.toJson();
        this.flushTempEntry()
        return data;
    }
}