import axios from "axios"
import logging from "./logger"
import EbayAuthToken from "ebay-oauth-nodejs-client";

function getEbayToken() {
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

const axiosInstance = axios.create({
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
