import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { ItemSummary } from "../types/EbayApiTypes/ebaySeachTypes";
import { NewItemFormat } from "../server/event/NewItemEvent";

export type SSEContextType = {
    data: undefined | NewItemFormat
}

export const SSEContext = createContext<SSEContextType | undefined>(undefined) 
export function SSEProvider(
    {endpoint, children}: 
    {
        endpoint: string
        children?: ReactNode
    }
) {
    let [data, setData] = useState<undefined | NewItemFormat>(undefined)

    useEffect(() => {
        const eventSource = new EventSource(endpoint)
        eventSource.onmessage = (e) => {
            setData(JSON.parse(e.data))
        }
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