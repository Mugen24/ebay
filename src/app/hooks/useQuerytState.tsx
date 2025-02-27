import { createContext, ReactElement, ReactNode, useContext, useEffect, useState, useRef, useCallback, useReducer, ReducerWithoutAction, Reducer, ReducerAction, Dispatch, cache, MutableRefObject } from 'react';
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
    resp: EbaySearchReturn | undefined
    // setResp: (resp: EbaySearchReturn) => void
    getNoPage: () => number | undefined
    toPage: (number: number) => void
    stateDispatch: Dispatch<ReducerAction<Reducer<SEbaySearch, stateActionType>>>
    cacheCategories: MutableRefObject<Category[]>
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
    const cacheCategories = useRef<Category[]>([])


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
            logging.info("Updating Item location")
            state = EbaySaverState.setLocation(state, action.results.country)
            if (!settingObject.isLoading) {
                settingObject.setItemLocation(action.results.country)
            } else {
                logging.debug("Setting not loaded cannot save ItemLocation")
            }

            return {...state}
        }

        if (action.type === "updateSetting") {
            logging.debug("updatingSetting")
            logging.debug("settingObj: ", settingObject)
            logging.debug("settingCurr: ", settingObject.setting?.current?.itemLocation)
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
                const [key, value] = EbaySaverState.makeUserAddressHeader(defaultShippingAddress, defaultShippingPostcode)
                clientApiManager.optionalData.paramHeader = clientApiManager.optionalData.paramHeader ?? {}
                clientApiManager.optionalData.paramHeader[key] = `${value}`
            }
            if (defaultItemLocation) {
                state = EbaySaverState.setLocation(state, defaultItemLocation)
            }
            logging.debug("Updated Setting", state)
            return {...state}
        }

        throw new Error(`State not implemented: ${action}`)
    }

    //Intialise first state using the searchParam
    function initState(query: any) {
        logging.debug("URL query:", query)
        const urlQuery = URLSearchParamsToJson(new URLSearchParams(query))
        let temp_state = EbaySaverState.parse(urlQuery)
        logging.debug("Initial State: ", temp_state)
        //temp_state = EbaySaverState.addCategoryRequest(temp_state)
        return temp_state
    }
    const [state, stateDispatch] = useReducer<Reducer<SEbaySearch, stateActionType>>(reducer, initState(query))

    const setState = useCallback((newState: SEbaySearch) => {
        stateDispatch({
            "type": "updateState",
            "results": newState
        })
    }, [])
    //
    //UPDATE: state object once setting is loaded
    useEffect(() => {
        // Loads defaults from setting
        if (!settingObject.isLoading) {
            logging.group("Setting loaded updating setting")
            stateDispatch({
                "type": "updateSetting"
            })
        } else {
            logging.group("Setting not loaded yet")
        }
        logging.groupEnd()
        }, 
        [
            settingObject.isLoading,
            settingObject
        ]
    )

    //INIT: writes the first initial state using searchParam
    //TODO: move this into reducer init
    useEffect(() => {
        logging.debug("URL query:", query)
        const urlQuery = URLSearchParamsToJson(new URLSearchParams(query))
        let temp_state = EbaySaverState.parse(urlQuery)
        //temp_state = EbaySaverState.addCategoryRequest(temp_state)
        stateDispatch({"type": "updateState", "results": temp_state})
    }, [])

    //Fetch data from api everytime state changed
    useEffect(() => {
        (async () => {
            logging.group("Loading new response")
            logging.debug("State: ", state)
            logging.debug("Resp : ", resp)
            //Do nothing until setting has loaded
            if (settingObject.isLoading) return 

            // first search
            if (!resp) {
                logging.debug("No resp")
                let tempState = {...state}
                //Add special request for categories
                tempState = EbaySaverState.addCategoryRequest(tempState)
                const [outcome, data] = await clientApiManager.search(tempState)
                if (outcome) {
                    setResp(data)
                    // Save the categoryOnce so we don't ever have to request it again 
                    // for the item
                    cacheCategories.current = data.refinement.categoryDistributions 
                } else {
                    logging.error("Api return nothing")
                }
            } else {
                const [outcome, data] = await clientApiManager.search(state)
                logging.debug("New resp: ", data)
                if (outcome) {
                    setResp(data)
                } else {
                    logging.error("Api return nothing")
                }
            }
            logging.groupEnd()
        })()
    }, [state])



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


    const value: QueryStateType = {
        state,
        // setState,
        resp,
        // setResp,
        stateDispatch,
        getNoPage,
        toPage,
        cacheCategories,
    }

    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
