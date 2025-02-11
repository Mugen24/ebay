"use  client"
import axios from "axios";
import { EbaySearch, EbaySearchReturn, DistanceFromPickupLocation } from '../types/EbayApiTypes/ebaySeachTypes';
import { EbaySaverState } from "../EbayApi/EbaySaverState";
import logging from "../utils/logger";

const BASE = "api"
export async function search(query: EbaySearch): Promise<EbaySearchReturn | undefined> {
    logging.debug("Item Search request", query)
    const path= `${BASE}/search`;
    const searchParam = EbaySaverState.toSearchParams(query)
    logging.debug(searchParam.toString())
    return axios.get(`${path}?${searchParam.toString()}`)
    .then(resp => {
        return resp.data
    })
    .catch(error => {
        logging.warn("Server error:", error)
        return undefined
    })
}
