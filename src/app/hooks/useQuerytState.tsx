import { createContext, ReactElement, ReactNode, useContext, useEffect, useState, useRef } from 'react';
import { Countries, EbaySaverState, SEbaySearch } from '../EbayApi/EbaySaverState';
import { EbaySearch, EbaySearchReturn } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import axios, { Axios, AxiosRequestConfig } from "axios";

export type QueryStateType = {
    state: SEbaySearch
    setState: (sEbaySearch: SEbaySearch) => void
    resp: EbaySearchReturn
    setResp: (resp: EbaySearchReturn) => void
    setAddress: (country: keyof typeof Countries, postcode: Number) => void
}
export const QueryStateContext = createContext({});

class ClientApiManager {
    baseConfig: AxiosRequestConfig
    constructor(config?: AxiosRequestConfig) {
        this.baseConfig = config ?? {
            baseURL: "api"
        }
    }

    async search(query: EbaySearch): Promise<EbaySearchReturn | undefined> {
        logging.debug("Item Search request", query)
        const path= `/search`;
        const searchParam = EbaySaverState.toSearchParams(query)
        logging.debug(searchParam.toString())
        return axios.post(
            `${path}?${searchParam.toString()}`,
            {
                "paramHeader": this.baseConfig.data
            },
            this.baseConfig
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


export function QueryStateProvider({children}: {children: ReactNode}) {
    const [state, setState] = useState<EbaySaverState>()
    const [resp, setResp] = useState<EbaySearchReturn>()
    const apiManagerRef = useRef(new ClientApiManager())


    function setAddress(country: keyof typeof Countries, postcode: Number) {
        const [key, value] = EbaySaverState.getUserAddressHeader(country, postcode)
        const apiManager = apiManagerRef.current
        apiManager.baseConfig.data = apiManager.baseConfig.data ?? {}
        apiManager.baseConfig.data[key] = `${value}`
        setState({...state})
    }

    useEffect(() => {
        logging.debug("Query state has changed!", state);
        (async () => {
            if (state) {
                const resp = await apiManagerRef.current.search(state)
                logging.debug("New resp: ", resp)
                if (resp) {
                    setResp(resp)
                } else {
                    logging.error("Api return nothing")
                }
            }
        })()
    }, [state])

    const value = {
        state,
        setState,
        resp,
        setResp,
        setAddress
    }

    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType