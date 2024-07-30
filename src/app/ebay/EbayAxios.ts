import { AxiosRequestConfig } from "axios";
import { EbaySearch, EbaySearchReturn } from "./types/ebaySeachTypes";
import { EbayItem } from "./ebay/EbayItem";

export const baseAxios: AxiosRequestConfig = { 
    baseURL: "http://localhost:3000",
    transformResponse: [
        (res) => {
            console.log(res);
            let ebayReturn: EbaySearchReturn = JSON.parse(res) 
            return ebayReturn
        }
    ]
}

