"use  client"
import axios from "axios";
import { EbaySearch, EbaySearchReturn, DistanceFromPickupLocation } from '../types/EbayApiTypes/ebaySeachTypes';
import { EbaySaverState } from "../EbayApi/EbaySaverState";
import logging from "./logger";
import { SettingType } from "../types/SettingType";

export type OptionalDataType = {
    "paramHeader"?: Record<string, string>
}

export class ClientApiManager {
    optionalData: OptionalDataType
    static BASE = "api"
    constructor(optionalData?: OptionalDataType) {
        this.optionalData = optionalData ?? {}
    }
    async getSetting(): Promise<SettingType> {
        logging.debug("Fetching default setting")
        const path = `${ClientApiManager.BASE}/setting`
        return axios.post(path)
        .then(resp => {
            logging.debug("Setting:", resp.data)
            return resp.data
        })
        .catch(error => {
            logging.error("Unable to fetch setting:", error)
            return {}
        })
    }

    async setSetting(setting: SettingType) {
        logging.debug("Saving setting", setting)
        const path = `${ClientApiManager.BASE}/setting`
        return axios.put(path, setting)
        .catch(error => {
            logging.error("Unable to save setting", error)
        })
    }

    async search(query: EbaySearch): Promise<EbaySearchReturn | undefined> {
        logging.debug("Item Search request", query)
        const path= `${ClientApiManager.BASE}/search`;
        const searchParam = EbaySaverState.toSearchParams(query)
        logging.debug("Search url", searchParam.toString())
        logging.debug(ClientApiManager.BASE)

        return axios.post(
            `${path}?${searchParam.toString()}`, this.optionalData, {
            }
        )

        .then(resp => {
            return resp.data
        })
        .catch(error => {
            logging.warn("Server error:", error)
            return undefined
        })
    }


}