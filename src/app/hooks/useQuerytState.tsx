import { createContext, ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { EbaySaverState, SEbaySearch } from '../EbayApi/EbaySaverState';
import { EbaySearchReturn } from "../types/EbayApiTypes/ebaySeachTypes";
import { search } from "./useApi";
import logging from "../utils/logger";

export type QueryStateType = {
    state: SEbaySearch
    setState: (sEbaySearch: SEbaySearch) => void
    resp: EbaySearchReturn
    setResp: (resp: EbaySearchReturn) => void
}
export const QueryStateContext = createContext({});

export function QueryStateProvider({children}: {children: ReactNode}) {
    const [state, setState] = useState<EbaySaverState>()
    const [resp, setResp] = useState<EbaySearchReturn>()

    useEffect(() => {
        logging.debug("Query state has changed!", state);
        (async () => {
            if (state) {
                const resp = await search(state)
                logging.debug("New resp: ", resp)
                if (resp) {
                    setResp(resp)
                } else {
                    logging.error("Api return nothing")
                }
            }
        })()
    }, [state])

    return (
        <QueryStateContext.Provider value={{state, setState, resp, setResp}}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType