import { createContext, ReactElement, ReactNode, useContext, useEffect, useState, useRef, useCallback, useReducer, ReducerWithoutAction, Reducer, ReducerAction, Dispatch } from 'react';
import { Countries, EbaySaverState, Filter, SEbaySearch } from '../EbayApi/EbaySaverState';
import { Category, EbaySearch, EbaySearchReturn, SortField } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import { useSetting } from './useSetting';
import { clientApiManager } from '../utils/clientApiManager';
import { useSearchParams } from 'next/navigation';
import { URLSearchParamsToJson } from '../actions/utils';
import { CategoryId } from '../server/setting/categoryManager';
import { setting } from '../server/setting/settings';

export type QueryStateType = {
    state: SEbaySearch
    // setState: (sEbaySearch: SEbaySearch) => void
    resp: EbaySearchReturn
    // setResp: (resp: EbaySearchReturn) => void
    getNoPage: () => number
    toPage: (number: number) => void
    stateDispatch: Dispatch<ReducerAction<Reducer<SEbaySearch, stateActionType>>>
}
export const QueryStateContext = createContext({});


type updateFilterStateType<G extends keyof Filter> = {
    "key": G,
    "value": Filter[G]
}

type stateActionType = 
    | {type: 'updateState', results: SEbaySearch}
    | {type: 'updateCategory', results: Category["categoryId"]}
    | {type: 'updateFilterState', results: updateFilterStateType<any>}
    | {type: 'updateSortState', results: SortField}
    | {type: 'updateUserAddress', results: {
        "country": keyof typeof Countries,
        "postcode": number,
      }}
    | {type: 'updateItemLocation', results: {
        "country": keyof typeof Countries
      }}
    | {type: 'updateSetting'}
    | {type: 'loading'}


export function QueryStateProvider({children}: {children: ReactNode}) {

    const [resp, setResp] = useState<EbaySearchReturn>()
    const settingObject = useSetting()
    const query = useSearchParams().toString()


    const reducer = (state: SEbaySearch, action: stateActionType): SEbaySearch => {
        if (action.type === "updateState") {
            const updatedState = action.results
            return {
                ...state,
                ...updatedState
            }
        }

        if (action.type === "updateCategory") {
            const newState = {
                ...state,
                "category_ids": action.results
            }
            window.history.pushState(null, "", `?${EbaySaverState.toSearchParams(newState).toString()}`)
            return newState
        }
        if (action.type === "updateFilterState") {
            const filterKey = action.results["key"]
            const filterValues = action.results["value"]

            logging.info("Set filter state: ", filterKey, ":", filterValues)
            if (filterValues.length === 0) {
                EbaySaverState.addUniqueFilter(state, filterKey, filterValues[0],  true)
            }
            else {
                // For array for values
                // First value must clean the previous value
                EbaySaverState.addUniqueFilter(state, filterKey, filterValues[0],  true)
                // Any subsequently should be clear the previous value
                for (let i = 1; i < filterValues.length; i++) {
                    EbaySaverState.addUniqueFilter(state, filterKey, filterValues[i])
                }
            }

            window.history.pushState(null, "", `?${EbaySaverState.toSearchParams(state).toString()}`)
            return {
                ...state
            }
        }

        if (action.type === "updateSortState") {
            logging.info("Updating sort")
            state.sort = action.results
            window.history.pushState(null, "", `?${EbaySaverState.toSearchParams(state).toString()}`)
            return {
                ...state,
            }
        }

        if (action.type === "updateUserAddress") {
            const [key, value] = EbaySaverState.makeUserAddressHeader(action.results.country, action.results.postcode)
            clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            clientApiManager.optionalData.paramHeader[key] = `${value}`
            if (!settingObject.isLoading) {
                 settingObject.setShippingLocation(action.results.country, action.results.postcode)
            } else {
                 logging.debug("Setting not loaded cannot save useAddress")
            }
            //Just to refresh and refetch
            return {...state}
        }

        if (action.type === "updateItemLocation") {
            EbaySaverState.setLocation(state, action.results.country)
            if (!settingObject.isLoading) {
                settingObject.setItemLocation(action.results.country)
            } else {
                logging.debug("Setting not loaded cannot save ItemLocation")
            }
            return {...state}
        }

        if (action.type === "updateSetting") {
            if (settingObject.isLoading) return state
            const setting = settingObject.setting.current
            if (!setting) return state
            logging.group("Loading default setting")
            logging.debug("isLoading: ", `${settingObject.isLoading}`)
            logging.debug("setting: ", `${JSON.stringify(settingObject.setting)}`)
            const defaultItemLocation = setting.itemLocation
            const defaultShippingAddress = setting.shippingLocation
            const defaultShippingPostcode = setting.shippingPostcode

            if (defaultShippingAddress && defaultShippingPostcode) {
                logging.info("Default shipping information: ", defaultShippingAddress, defaultShippingPostcode)
                /*
                const [key, value] = EbaySaverState.getUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
                const paramHeader = clientApiManager.optionalData.paramHeader ?? {}
                // TODO: Rework, this particular paramHeader can have other filter
                if (!paramHeader[key]) {
                    setAddress(defaultShippingAddress, defaultShippingPostcode)
                }
                */
                const [key, value] = EbaySaverState.makeUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
                clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
                clientApiManager.optionalData.paramHeader[key] = `${value}`
                if (!settingObject.isLoading) {
                    settingObject.setShippingLocation(defaultShippingAddress, defaultShippingPostcode)
                } else {
                    logging.debug("Setting not loaded cannot save useAddress")
                }
            //Just to refresh and refetch
            }

            if (defaultItemLocation) {
                /*
                const filter = state?.filter ?? {}
                if (!filter["itemLocationCountry"]) {
                    logging.info("Default item location: ", defaultItemLocation)
                    setItemLocation(defaultItemLocation)
                }
                */

                EbaySaverState.setLocation(state, defaultItemLocation)
                if (!settingObject.isLoading) {
                    settingObject.setItemLocation(defaultItemLocation)
                } else {
                    logging.debug("Setting not loaded cannot save ItemLocation")
                }
            }
            return {...state}
        }

        throw new Error(`State not implemented: ${action}`)
    }

    function initState(query: any) {
        logging.debug("URL query:", query)
        const urlQuery = URLSearchParamsToJson(new URLSearchParams(query))
        let temp_state = EbaySaverState.parse(urlQuery)
        logging.debug("Initial State: ", temp_state)
        temp_state = EbaySaverState.addCategoryRequest(temp_state)
        //stateDispatch({"type": "updateState", "results": temp_state})
        return temp_state
    }
    const [state, stateDispatch] = useReducer<Reducer<SEbaySearch, stateActionType>>(reducer, initState(query))

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



    /*
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
        const tempState = state ?? {}
        EbaySaverState.setLocation(tempState, country)
        settingObject.setItemLocation(country)
        setState({...tempState})
    }, [
        state,
        setState,
        settingObject
    ])
    */


    useEffect(() => {
        // Loads defaults from setting
        logging.group("Setting loaded updating setting")
        stateDispatch({
            "type": "updateSetting"
        })
        if (settingObject.isLoading) return 
        if (!settingObject.setting.current) return 

        const setting = settingObject.setting.current
        logging.group("Loading default setting")
        logging.debug("isLoading: ", `${settingObject.isLoading}`)
        logging.debug("setting: ", `${JSON.stringify(settingObject.setting)}`)
        const defaultItemLocation = setting.itemLocation
        const defaultShippingAddress = setting.shippingLocation
        const defaultShippingPostcode = setting.shippingPostcode

        if (defaultShippingAddress && defaultShippingPostcode) {
            logging.info("Default shipping information: ", defaultShippingAddress, defaultShippingPostcode)
            /*
            const [key, value] = EbaySaverState.getUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
            const paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            // TODO: Rework, this particular paramHeader can have other filter
            if (!paramHeader[key]) {
                setAddress(defaultShippingAddress, defaultShippingPostcode)
            }
            */
            const [key, value] = EbaySaverState.makeUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
            clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            clientApiManager.optionalData.paramHeader[key] = `${value}`
            if (!settingObject.isLoading) {
                settingObject.setShippingLocation(defaultShippingAddress, defaultShippingPostcode)
            } else {
                logging.debug("Setting not loaded cannot save useAddress")
            }
        //Just to refresh and refetch
        }

        if (defaultItemLocation) {
            /*
            const filter = state?.filter ?? {}
            if (!filter["itemLocationCountry"]) {
                logging.info("Default item location: ", defaultItemLocation)
                setItemLocation(defaultItemLocation)
            }
            */

            stateDispatch({
                "type": "updateItemLocation",
                "results": {
                    "country": defaultItemLocation
                }
            })
            if (!settingObject.isLoading) {
                settingObject.setItemLocation(defaultItemLocation)
            } else {
                logging.debug("Setting not loaded cannot save ItemLocation")
            }
        }
        //return {...state}
        logging.groupEnd()
        }, 
        [
            settingObject.isLoading,
            settingObject
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
        stateDispatch,
        getNoPage,
        toPage,
    }

    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
