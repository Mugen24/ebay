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
    | {type: 'updateItemLocation', results: {
        "country": keyof typeof Countries
      }}
    | {type: 'replaceQueryState', results: SEbaySearch}


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

            // TODO: fix only convert when actually querying
            // EbaySaverState.addUniqueFilter(newState, filterKey, filterValues[0],  true)
            if (!newState["filter"]) {
                newState["filter"] = {}
            }
            newState["filter"][filterKey] = filterValues
        }

        else if (action.type === "updateSortOption") {
            newState.sort = action.results
        }

        else if (action.type === "updateItemLocation") {
            newState = EbaySaverState.setLocation(newState, action.results.country)
        }

        else if (action.type === "updateQuery") {
            newState.q = action.results
        }

        else if (action.type === "replaceQueryState") {
            newState = action.results
        }


        // const url = new URL(window.location.href)
        return newState
    }


    function fetchFromSearchParam(params: URLSearchParams): SEbaySearch {
        try {
            const itemData = params.get("query")
            if (itemData === null) {
                logging.warn("No query found")
                return {}
            }
            else {
                const data = JSON.parse(itemData)
                return data
            }
        }
        catch (e) {
            console.warn(e)
            // router.push("/")
            return {}
        }
    }
    const [queryState, queryHandler] = useReducer(
        reducer,
        useSearchParams(),
        fetchFromSearchParam
    )

    const searchParam = useSearchParams()
    useEffect(() => {
        console.log("new search")
        console.log(searchParam)
        const newQueryState = fetchFromSearchParam(searchParam)
        queryHandler({
            type: "replaceQueryState",
            results: newQueryState
        })
    }, [searchParam]) 

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
