import { createContext, ReactElement, ReactNode, useContext, useEffect, useState, useRef, useCallback, useReducer, ReducerWithoutAction, Reducer, ReducerAction } from 'react';
import { Countries, EbaySaverState, SEbaySearch } from '../EbayApi/EbaySaverState';
import { EbaySearch, EbaySearchReturn } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import axios, { Axios, AxiosRequestConfig } from "axios";
import { useSetting } from './useSetting';
import { log } from 'console';
import { clientApiManager } from '../utils/clientApiManager';
import { useSearchParams } from 'next/navigation';
import { URLSearchParamsToJson } from '../actions/utils';

export type QueryStateType = {
    state: SEbaySearch
    // setState: (sEbaySearch: SEbaySearch) => void
    resp: EbaySearchReturn
    // setResp: (resp: EbaySearchReturn) => void
    setAddress: (country: keyof typeof Countries, postcode: number) => void
    getNoPage: () => number
    toPage: (number: number) => void
    setItemLocation: (country: keyof typeof Countries) => void
}
export const QueryStateContext = createContext({});



type stateActionType = 
    | {type: 'updateState', results: SEbaySearch}
    | {type: 'loading'}

function reducer(state: SEbaySearch, action: stateActionType) {
    if (action.type === "updateState") {
        const updatedState = action.results
        return {
            ...state,
            ...updatedState
        }
    }
    throw new Error(`State not implemented: ${action}`)
}

export function QueryStateProvider({children}: {children: ReactNode}) {

    const [state, stateDispatch] = useReducer<Reducer<SEbaySearch, stateActionType>>(reducer, {})

    const [resp, setResp] = useState<EbaySearchReturn>()
    const settingObject = useSetting()
    const setting = settingObject.setting
    const query = useSearchParams().toString()
    const setState = useCallback((newState: SEbaySearch) => {
        stateDispatch({
            "type": "updateState",
            "results": newState
        })
    }, [])

    useEffect(() => {
        logging.debug("URL query:", query)
        const urlQuery = URLSearchParamsToJson(new URLSearchParams(query))
        let temp_state = EbaySaverState.parse(urlQuery)
        temp_state = EbaySaverState.addCategoryRequest(temp_state)
        stateDispatch({"type": "updateState", "results": temp_state})
    }, [query])

    useEffect(() => {
        (async () => {
            const [outcome, data] = await clientApiManager.search(state)
            logging.debug("New resp: ", data)
            if (outcome) {
                setResp(data)
            } else {
                logging.error("Api return nothing")
            }
        })()
    }, [state])



    const setAddress = useCallback(
        (country: keyof typeof Countries, postcode: number) => {
            const [key, value] = EbaySaverState.getUserAddressHeader(country, postcode)
            clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            clientApiManager.optionalData.paramHeader[key] = `${value}`
            settingObject.setShippingLocation(country, postcode)
            setState({...state} as SEbaySearch)
        }
        ,[state, setState, settingObject]
    )

    const setItemLocation = useCallback((country: keyof typeof Countries) => {
        const tempState= state ?? {}
        EbaySaverState.setLocation(tempState, country)
        settingObject.setItemLocation(country)
        setState({...tempState})
    }, [
        state,
        setState,
        settingObject
    ])


    useEffect(() => {
        // Loads defaults from setting
        logging.group("Loading default setting")
        const defaultItemLocation= setting.itemLocation
        const defaultShippingAddress = setting.shippingLocation
        const defaultShippingPostcode= setting.shippingPostcode

        if (defaultShippingAddress && defaultShippingPostcode) {
            logging.info("Default shipping information: ", defaultShippingAddress, defaultShippingPostcode)
            const [key, value] = EbaySaverState.getUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
            const paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            // TODO: Rework, this particular paramHeader can have other filter
            if (!paramHeader[key]) {
                setAddress(defaultShippingAddress, defaultShippingPostcode)
            }
        }

        if (defaultItemLocation) {
            const filter = state?.filter ?? {}
            if (!filter["itemLocationCountry"]) {
                logging.info("Default item location: ", defaultItemLocation)
                setItemLocation(defaultItemLocation)
            }
        }
        logging.groupEnd()
        }, 
        [
            setAddress,
            setItemLocation,
            setting.itemLocation,
            setting.shippingLocation,
            setting.shippingPostcode,
            state?.filter
        ]
    )

    function getNoPage() {
         // TODO: could also be fetch from state
         logging.group("Calculating pages")
         const pageLimit = resp?.limit 
         const pageOffset = resp?.offset
         const pageNext = resp?.next
         const pagePrev= resp?.prev
         const total = resp?.total

         if (total && pageLimit) {
             const noPage = Math.floor(Number(total) / Number(pageLimit))
             logging.debug("NoPage", resp)
             logging.debug("NoPage", noPage)
             logging.groupEnd()
             return noPage
         }
         
         logging.warn("Need intial response first", state)
         logging.groupEnd()
         return undefined
    }

    function toPage(number: number) {
        logging.debug("Jumping to page: ", number)
        let offsetDefault = 50
        if (state?.limit) {
            offsetDefault = Number(state.limit)
        }
        logging.debug("Offset by: ", offsetDefault)

        if (state) {
            state.offset = `${offsetDefault * number}`
            logging.debug(state)
            setState({...state})
        } else {
            logging.warn("Need intial query first", state)
        }
    }


    const value = {
        state,
        // setState,
        resp,
        // setResp,
        setAddress,
        getNoPage,
        toPage,
        setItemLocation,
    }

    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
