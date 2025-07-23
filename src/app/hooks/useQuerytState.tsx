'use client';
import { createContext, ReactElement, ReactNode, useContext, useEffect, useReducer, Reducer, ReducerAction, Dispatch, cache, MutableRefObject } from 'react';
import { Countries, EbaySaverState, Filter, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { Category, EbaySearch, EbaySearchReturn, SortField } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import { URLSearchParamsToJson } from '../actions/utils';
import { useStateManager } from './useStateManagement';
import { useSearchParams } from 'next/navigation';
import { AxiosContext, AxiosContextType } from './useAxios';
import axios from 'axios';

export type QueryStateType = {
    queryState: SEbaySearch
    response: EbaySearchReturn | undefined
    queryHandler: Dispatch<ReducerAction<Reducer<SEbaySearch, QueryActionType>>>
}
export const QueryStateContext = createContext({});


type updateFilterStateType<G extends keyof Filter> = {
    "key": G,
    "value": Filter[G]
}

type QueryActionType = 
    | {type: 'updateQuery', results: SEbaySearch}
    | {type: 'updateCategory', results: Category["categoryId"]}
    | {type: 'updateFilterOption', results: updateFilterStateType<any>}
    | {type: 'updateSortOption', results: SortField}
    | {type: 'updateUserAddress', results: {
        "country": keyof typeof Countries,
        "postcode": number,
      }}
    | {type: 'updateItemLocation', results: {
        "country": keyof typeof Countries
      }}


export function QueryStateProvider({children}: {children: ReactNode}) {
    const {getAxios, getConfig, updateConfig} = useContext<AxiosContextType | undefined>(AxiosContext)!

    const stateManager = useStateManager()
    const response: EbaySearchReturn | undefined = undefined

    const reducer = (state: SEbaySearch, action: QueryActionType): SEbaySearch => {
        logging.group("QueryState Reducer")
        logging.debug("Action: ", action)
        logging.debug("OldState: ", state)

        let newState: SEbaySearch | undefined = undefined;
        if (action.type === "updateQuery") {
            const updatedState = action.results
            newState = {
                ...state,
                ...updatedState
            }
        }

        else if (action.type === "updateCategory") {
            newState = {
                ...state,
                "category_ids": action.results
            }
            window.history.pushState(null, "", `?${EbaySaverState.toSearchParams(newState).toString()}`)
        }

        else if (action.type === "updateFilterOption") {
            const filterKey = action.results["key"]
            const filterValues = action.results["value"]

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
            newState = {
                ...state
            }
        }

        else if (action.type === "updateSortOption") {
            state.sort = action.results
            window.history.pushState(null, "", `?${EbaySaverState.toSearchParams(state).toString()}`)
            newState = {
                ...state
            }
        }

        else if (action.type === "updateUserAddress") {
            const [key, value] = EbaySaverState.makeUserAddressHeader(action.results.country, action.results.postcode)
            const config = getConfig()
            config.headers = config.headers ?? {}
            config.headers[key] = value
            updateConfig(config)

            // stateManager.setShippingLocation(action.results.country, action.results.postcode)
            // throw new Error("")

            newState = {
                ...state
            }
        }
        else if (action.type === "updateItemLocation") {
            logging.info("Updating Item location")
            state = EbaySaverState.setLocation(state, action.results.country)
            // stateManager.setItemLocation(action.results.country)
            // throw new Error("")

            newState = {
                ...state
            }
        }

        // else if (action.type === "updateSetting") {
        //     const setting = stateManager.userData.setting
        //     if (!setting) return state

            // const defaultItemLocation = setting.itemLocation
            // const defaultShippingAddress = setting.shippingLocation
            // const defaultShippingPostcode = setting.shippingPostcode

            // if (defaultShippingAddress && defaultShippingPostcode) {
            //     const [key, value] = EbaySaverState.makeUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
            //     clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
            //     clientApiManager.optionalData.paramHeader[key] = `${value}`
            // }
            // if (defaultItemLocation) {
            //     state = EbaySaverState.setLocation(state, defaultItemLocation)
            // }
        //     newState = {
        //         ...state
        //     }
        // }

        else {
            logging.error(`State not implemented: ${action}`)
            return state
        }

        if (!newState) {
            logging.error(`New state has not been assigned`)
        }
        logging.debug("New state: ", newState)
        logging.groupEnd()
        return newState
    }

    const [queryState, queryHandler] = useReducer(
        reducer,
        useSearchParams(),
        (query)  => {
            logging.debug("Detect query change:", query)
            const urlQuery = URLSearchParamsToJson(new URLSearchParams(query))
            let temp_state = EbaySaverState.parse(urlQuery)
            logging.debug("New state from query: ", temp_state)
            return temp_state
        }
    )

    //Fetch data from api everytime state changed
    useEffect(() => {
        (async () => {
            logging.group("Loading new response")
            logging.debug("State: ", queryState)
            logging.debug("Resp: ", response)

            // // first search
            // if (!resp) {
            //     logging.debug("No resp")
            //     let tempState = {...state}
            //     //Add special request for categories
            //     tempState = EbaySaverState.addCategoryRequest(tempState)
            //     const [outcome, data] = await clientApiManager.search(tempState)
            //     if (outcome) {
            //         setResp(data)
            //         // Save the categoryOnce so we don't ever have to request it again 
            //         // for the item
            //         cacheCategories.current = data.refinement.categoryDistributions 
            //     } else {
            //         logging.error("Api return nothing")
            //     }
            // } else {
            //     console.log(state)
            //     const [outcome, data] = await clientApiManager.search(state)
            //     logging.debug("New resp: ", data)
            //     if (outcome) {
            //         setResp(data)
            //     } else {
            //         logging.error("Api return nothing")
            //     }
            // }
            // logging.groupEnd()
        })()
    }, [queryState])




    const value: QueryStateType = {
        queryState,
        response,
        queryHandler,
    }

    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
