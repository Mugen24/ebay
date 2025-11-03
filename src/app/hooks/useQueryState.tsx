'use client'; import { createContext, ReactElement, ReactNode, useContext, useEffect, useReducer, Reducer, ReducerAction, Dispatch, cache, MutableRefObject, useRef, useState } from 'react';
import { Countries, EbaySaverState, Filter, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { Category, EbaySearch, EbaySearchReturn, SortField } from "../types/EbayApiTypes/ebaySeachTypes";
import logging from "../utils/logger";
import { URLSearchParamsToJson } from '../actions/utils';
import { useSearchParams } from 'next/navigation';
import { AxiosContext } from './useAxios';
import { useRouter } from 'next/navigation';

export type ExtraDataType = {
    queryID?: string
}

export type QueryStateType = {
    queryState: SEbaySearch
    queryHandler: Dispatch<ReducerAction<Reducer<SEbaySearch, QueryActionType>>>
    response: EbaySearchReturn | undefined
    updateResponse: () => Promise<void>
    extraData?: ExtraDataType
}
export const QueryStateContext = createContext({});


type updateFilterStateType<G extends keyof Filter> = {
    "key": G,
    "value": Filter[G]
}

export type QueryActionType = 
    | {type: 'updateQuery', results: string}
    | {type: 'updateCategory', results: Category["categoryId"] | undefined}
    | {type: 'updateFilterOption', results: updateFilterStateType<any>}
    | {type: 'updateSortOption', results: SortField}
    | {type: 'updateItemLocation', results: {
        "country": keyof typeof Countries
      }}
    | {type: 'updateUserLocation', results: {
        "country": keyof typeof Countries
      }}
    | {type: 'replaceQueryState', results: SEbaySearch}
    | {type: 'replaceFromSearchParams', results?: URLSearchParams}


export function QueryStateProvider({initialData, children}: {initialData?: EbaySearch, children: ReactNode}) {
    const {getAxios, getConfig, updateConfig} = useContext(AxiosContext)!
    const [response, _setResponse] = useState<EbaySearchReturn | undefined>(undefined)
    const axios = getAxios()
    const router = useRouter()
    let [extraData, setExtraData] = useState({})

    const searchParam = useSearchParams()

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

    const reducer = (state: SEbaySearch, action: QueryActionType): SEbaySearch => {
        let newState: SEbaySearch = {...state};

        if (action.type === "updateCategory") {
            if (action.results) {
                newState["category_ids"] = action.results
            } else {
                delete newState["category_ids"]
            }


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

        else if (action.type === "replaceFromSearchParams") {
            const params = (action.results) ? action.results : searchParam

            newState = fetchFromSearchParam(params)
            console.log(params)
            console.log(newState)
        }


        // const url = new URL(window.location.href)
        return newState
    }



    const [queryState, queryHandler] = useReducer(
        reducer,
        useSearchParams(),
        fetchFromSearchParam
    )


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
        extraData 
    }


    return (
        <QueryStateContext.Provider value={value}>
            {children}
        </QueryStateContext.Provider>
    )
}

export const useQueryState = () => useContext(QueryStateContext) as QueryStateType
