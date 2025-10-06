import { ReactNode, useEffect, useState } from "react"
import { useAxios } from '../../hooks/useAxios';
// import { WatchedItem } from './WatchedItem';
import { EbayItem } from "../baseComponents/EbayItem";

export function WatchedItemGallery() {
    const {getAxios} = useAxios()
    const axios = getAxios()

    const [items, setItems] = useState<Array<ReturnType<typeof EbayItem>>>([])

    useEffect(() => {
        (async () => {
            const resp = await axios.get("setting/watch/item")            
            const rawData: Array<any> = JSON.parse(resp.data)["items"]
            const newItems = []
            for (let i = 0; i < rawData.length; i++) {
                const {id, data} = rawData[i]
                const ebayItem = JSON.parse(data)

                newItems.push(
           <EbayItem ebayItem={ebayItem} key={id}>
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