"use  client"
import axios, { AxiosResponse } from "axios";
import { EbaySearch, EbaySearchReturn, DistanceFromPickupLocation } from '../types/EbayApiTypes/ebaySeachTypes';
import { EbaySaverState } from "../server/EbayApi/EbaySaverState";
import logging from "./logger";
import { SettingType } from "../types/SettingType";
import { OptionalDataType } from "../types/clientApiTypes";
import { Outcome } from "../types/Outcome";
import { EbayGetItem, EbayGetItemReturn } from "../types/EbayApiTypes/ebayGetItemTypes";
import { Categories } from "../server/setting/categoryManager";


class ClientApiManager {
    optionalData: OptionalDataType
    static BASE = "api"
    constructor() {
        this.optionalData = {}
    }

    updateData(data: OptionalDataType) {
        this.optionalData = Object.assign(data, this.optionalData)
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

    async getItem(query: EbayGetItem): Promise<Outcome<EbayGetItemReturn>> {
        logging.debug("Get item")
        const path = `${ClientApiManager.BASE}/search/getItem`
        return axios.post(path, query)
        .then(resp => {
            return [true, resp.data] as Outcome<EbayGetItemReturn>
        })
        .catch(error => {
            logging.error("Unable to get item", error)
            return [false, {} as EbayGetItemReturn]
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

    async search(query: EbaySearch): Promise<Outcome<EbaySearchReturn>> {
        logging.debug("Item Search request", query)
        const path= `${ClientApiManager.BASE}/search`;
        const searchParam = EbaySaverState.toSearchParams(query)
        logging.debug("Search url", searchParam.toString())
        logging.debug(ClientApiManager.BASE)

        return axios.post<EbaySearch, AxiosResponse<EbaySearchReturn>>(
            `${path}?${searchParam.toString()}`, this.optionalData, {}
        )
        .then(resp => {
            return [true, resp.data] as [boolean, typeof resp.data]
        })
        .catch(error => {
            logging.warn("Server error:", error)
            return [false, undefined] as [boolean, any]
        })
    }

    async getCategories(): Promise<Outcome<Categories>> {
        logging.debug("Fetching categories")
        const path = `${ClientApiManager.BASE}/categories`
        
        return axios.get<{}, AxiosResponse<Categories>>(
            path
        )
        .then(resp => {
            return [true, resp.data] as [boolean, typeof resp.data]
        })
        .catch(error => {
            logging.warn("Server error:", error)
            return [false, undefined] as [boolean, any]
        })

    }


}

export const clientApiManager = new ClientApiManager()

