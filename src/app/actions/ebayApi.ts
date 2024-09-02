import EbayAuthToken from "ebay-oauth-nodejs-client"
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios";
import { EbaySearch, EbaySearchReturn } from "@/app/types/ebaySeachTypes";
import { EbayGetItemReturn, EbayGetItem } from "@/app/types/ebayGetItemTypes";
import { writeFileSync } from "fs";

export class EbayApi {
    static scopes = ["https://api.ebay.com/oauth/api_scope"];
    static config = {
        baseURL: "https://api.ebay.com",
        headers: {
            "X-EBAY-C-ENDUSERCTX": "contextualLocation=country=AU,zip=2166",
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_AU",
            // "Authorization": `Bearer ${this.token}`
        }
    }
    token: string;
    axios: AxiosInstance;
    private constructor (token: string) {
        this.token = token;
        const configInstance = JSON.parse(JSON.stringify(EbayApi.config));
        //Added for authorisation
        configInstance["Authorization"] = `Bearer ${this.token}`;

        this.axios = axios.create(configInstance)
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
    //Creates a separated instance from the main this.axios property
    createAxiosInstance(config: AxiosRequestConfig) {
        const configInstance = config;
        //Added for authorisation
        // configInstance[["Authorization"] = `Bearer ${this.token}`;
        if (configInstance.headers) {
            configInstance.headers.Authorization = `Bearer ${this.token}`
        }

        return axios.create(
            configInstance
        )
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

    async search( config: EbaySearch | string ): Promise<EbaySearchReturn> {
        let res: AxiosResponse;
        //config is url returned by EbaySeachReturn[next]

        if (typeof config === "string") {
            res = await this.axios.get(config)
        }
        else {
            res = await this.axios.get("/buy/browse/v1/item_summary/search", 
                {
                    params: config
                }
            )
        }
        return res.data;
    }

    async getItem( options: EbayGetItem ): Promise<EbayGetItemReturn> {
        const res = await this.axios.get("/buy/browse/v1/item", {
            params: options
        })
        return res.data
    }

    async getCategories(categoryId: number) {
        console.log("call get cate")
        const ENDPOINT = "/commerce/taxonomy/v1/category_tree"
        const configInstance = JSON.parse(JSON.stringify(EbayApi.config))
        configInstance["headers"]["Accept-Encoding"] = "gzip";
        const axiosInstance = this.createAxiosInstance(configInstance)
        axiosInstance.get(`${ENDPOINT}/${categoryId}`)
        .then(result => {
            writeFileSync("temp2", JSON.stringify(result.data))
        })
        .catch(error => {
            writeFileSync("temp", JSON.stringify(error.toJSON()))
        })
        // return new Response(null, {status: 200})
    }

}

