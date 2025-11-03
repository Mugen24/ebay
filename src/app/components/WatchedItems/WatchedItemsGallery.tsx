import { ReactNode, useEffect, useState } from "react"
import { useAxios } from '../../hooks/useAxios';
// import { WatchedItem } from './WatchedItem';
import { EbayItem } from "../baseComponents/EbayItem";
import type { FavouriteItemType } from "@/app/server/api/setting/watch/item/route";
import { SSEProvider, useSSE } from "@/app/hooks/useSSE";
import type { ItemWatchListenerType } from "@/app/server/event/ItemWatchEvent";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { EbayGetItemReturn } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import { Gallery, GalleryItem, GalleryList, GalleryTitle } from "../baseComponents/Gallery";


type WatchItemType = {
    ebayItem: EbayGetItemReturn
    children?: ReactNode
}

function WatchItem(props: WatchItemType) {
    // Make the typing a bit better
    const {data}: {data: ItemWatchListenerType} = useSSE() 
    const [ebayItem, setEbayItem] = useState<EbayGetItemReturn>(props.ebayItem as unknown as EbayGetItemReturn)
    useEffect(() => {
        if (data && (data.id === ebayItem.itemId)) {
            setEbayItem(data.ebayGetItemReturn)
        }
    }, [data])

    // TODO: may need to explicitly translate data from search and getItem call
    return <EbayItem ebayItem={ebayItem as unknown as ItemSummary}/>
}


export function WatchedItemGallery() {
    const {getAxios} = useAxios()
    const axios = getAxios()

    const [items, setItems] = useState<FavouriteItemType[]>([])

    useEffect(() => {
        (async () => {
            const resp = await axios.get("setting/watch/item")            
            const rawData: FavouriteItemType[] = JSON.parse(resp.data)["items"]
            setItems(rawData)
        })()
    }, [])

    const renderedItems = items.map(i => {
        return (
            <GalleryItem key={i.id} asChild>
                <WatchItem ebayItem={i.ebayItem as unknown as EbayGetItemReturn}></WatchItem>
            </GalleryItem>
        )
    })


    return (
        <SSEProvider endpoint="api/setting/item/stream">
            <Gallery>
                <GalleryList>
                    {renderedItems}
                </GalleryList>
            </Gallery>
        </SSEProvider>
    )
}

