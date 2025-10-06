import { EbayEvent } from "./EbayEvent";
import { db } from "@/app/layout";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";

export type NewItemFormat = {
    "id": string,
    "query": EbaySearch,
    "items": ItemSummary[]
}

export interface NewItemSubscriber {
    update: (data: NewItemFormat) => void
}

export class NewItemEvent<T extends NewItemSubscriber> extends EbayEvent<T>{
    notify(newItems: NewItemFormat) {
        for (const listener of this.listeners) {
            listener.update(newItems)
        }
    }

    async mainLoop() {
        const queries = await db.all(`
            select id, lastCheckedEpoch, ebaySearch from favouriteQueries
        `)
        for (const query of queries) {
            (async () => {
                const {id, lastCheckedEpoch, ebaySearch} = query
                const [outcome, resp] = await ebayApi.search(JSON.parse(ebaySearch), {}, true)
                if (!outcome) {
                    logging.error("Failed event fetch")
                    return
                }

                const newItems: ItemSummary[] = []
                for (const item of resp.itemSummaries) {
                    const createdTimeEpoch= Date.parse(item.itemCreationDate) / 1000
                    // if (createdTimeEpoch <= lastCheckedEpoch) {
                    //     // break
                    //     skip
                    // } 
                    newItems.push(item)
                }

                const data: NewItemFormat = {
                    "id": id,
                    "query": JSON.parse(ebaySearch),
                    "items": newItems
                }

                this.notify(data) 
            })()
        }
    }


}
