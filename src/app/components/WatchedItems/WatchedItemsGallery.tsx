import { ReactNode, useEffect, useState } from "react"
import { useAxios } from '../../hooks/useAxios';
// import { WatchedItem } from './WatchedItem';
import { EbayItem } from "../baseComponents/EbayItem";
import { FavouriteItemType } from "@/app/server/api/setting/watch/item/route";

export function WatchedItemGallery() {
    const {getAxios} = useAxios()
    const axios = getAxios()

    const [items, setItems] = useState<Array<ReturnType<typeof EbayItem>>>([])

    useEffect(() => {
        (async () => {
            const resp = await axios.get("setting/watch/item")            
            const rawData: Array<FavouriteItemType> = JSON.parse(resp.data)["items"]

            const newItems = []
            for (let i = 0; i < rawData.length; i++) {
                const serverItem = rawData[i]
                const ebayItem = JSON.parse(serverItem.data)
                newItems.push(
           <EbayItem server={serverItem} ebayItem={ebayItem} key={serverItem.id}>
                    </EbayItem>
                )

            }
            setItems(newItems)
        })()
    }, [])


    return (
        <section>
            {items}
        </section>
    )
}