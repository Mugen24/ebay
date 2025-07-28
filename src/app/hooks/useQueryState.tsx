'use client';
import { createContext, ReactElement, ReactNode, useContext, useEffect, useReducer, Reducer, ReducerAction, Dispatch, cache, MutableRefObject, useRef, useState } from 'react';
import { Countries, EbaySaverState, Filter, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { Category, EbaySearch, EbaySearchReturn, SortField } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import { URLSearchParamsToJson } from '../actions/utils';
import { useSearchParams } from 'next/navigation';
import { AxiosContext } from './useAxios';
import { useRouter } from 'next/navigation';

export type QueryStateType = {
    queryState: SEbaySearch
    queryHandler: Dispatch<ReducerAction<Reducer<SEbaySearch, QueryActionType>>>
    response: EbaySearchReturn | undefined
    updateResponse: () => Promise<void>
}
export const QueryStateContext = createContext({});


type updateFilterStateType<G extends keyof Filter> = {
    "key": G,
    "value": Filter[G]
}

type QueryActionType = 
    | {type: 'updateQuery', results: string}
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
    const {getAxios, getConfig, updateConfig} = useContext(AxiosContext)!
    const [response, _setResponse] = useState<EbaySearchReturn | undefined>(undefined)
    const axios = getAxios()
    const router = useRouter()

    const reducer = (state: SEbaySearch, action: QueryActionType): SEbaySearch => {
        let newState: SEbaySearch = {...state};

        if (action.type === "updateCategory") {
            newState["category_ids"] = action.results
        }

        else if (action.type === "updateFilterOption") {
            const filterKey = action.results["key"]
            const filterValues = action.results["value"]

            if (filterValues.length === 0) {
                // TODO: fix only convert when actually querying
                EbaySaverState.addUniqueFilter(newState, filterKey, filterValues[0],  true)
            }
            else {
                // For array for values
                // First value must clean the previous value
                EbaySaverState.addUniqueFilter(newState, filterKey, filterValues[0],  true)
                // Any subsequently should be clear the previous value
                for (let i = 1; i < filterValues.length; i++) {
                    EbaySaverState.addUniqueFilter(newState, filterKey, filterValues[i])
                }
            }
        }

        else if (action.type === "updateSortOption") {
            newState.sort = action.results
        }

        else if (action.type === "updateUserAddress") {
            const [key, value] = EbaySaverState.makeUserAddressHeader(action.results.country, action.results.postcode)
            const config = getConfig()
            config.headers = config.headers ?? {}
            config.headers[key] = value
            updateConfig(config)
        }

        else if (action.type === "updateItemLocation") {
            EbaySaverState.setLocation(newState, action.results.country)
        }

        else if (action.type === "updateQuery") {
            newState.q = action.results
        }


        const url = new URL(window.location.href)
        return newState
    }


    const [queryState, queryHandler] = useReducer(
        reducer,
        useSearchParams(),
        (params)  => {
            try {
                const itemData = params.get("query")
                if (itemData === null) throw new Error("Invalid query")
                const data = JSON.parse(itemData)
                return data
            }
            catch (e) {
                console.warn(e)
                router.push("")
            }
        }
    )

    // useEffect(() => {
    //     const url = new URL(window.location.href)
    //     url.searchParams.set("query", JSON.stringify(queryState))
    //     window.history.pushState({}, "", url)
    // }, [queryState])

    async function updateResponse() {
        const resp = await axios.post("search", JSON.stringify(queryState))
        if (resp.status === 200) {
            _setResponse(JSON.parse(resp.data))
        } 
        else {
            logging.warn("Fails to update response", resp.headers)
        }
    }

    const value: QueryStateType = {
        queryState,
        queryHandler,
        response,
        updateResponse,
    }


    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
