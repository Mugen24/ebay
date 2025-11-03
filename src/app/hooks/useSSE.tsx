import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ItemSummary } from "../types/EbayApiTypes/ebaySeachTypes";
import { NewItemFormat } from "../server/event/NewItemEvent";
import { useAxios } from "./useAxios";
import logging from "../utils/logger";

export type SSEContextType = {
    data: undefined | any
}

export const SSEContext = createContext<SSEContextType | undefined>(undefined) 
export function SSEProvider(
    {endpoint, children}: 
    {
        endpoint: string
        children?: ReactNode
    }
) {
    const [data, setData] = useState<undefined | any>(undefined)

    const {getAxios} = useAxios()
    const axios = getAxios()

    useEffect(() => {
        const eventSource = new EventSource(axios.defaults.baseURL + endpoint)
        eventSource.onmessage = (e) => {
           setData(JSON.parse(e.data))
        }
        eventSource.onerror = (error => {
            logging.error("Client SSE:", error)
        })
    })

    const value = {
        data
    }

    return (
        <SSEContext.Provider value={value} >
            {children}
        </SSEContext.Provider>
    )
}

export const useSSE = () => useContext(SSEContext) as SSEContextType
