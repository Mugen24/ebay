import { EbayEvent } from "./EbayEvent";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { db } from "../main";

export type NewItemFormat = {
    "id": string,
    "query": EbaySearch,
    "items": ItemSummary[]
}

export interface NewItemSubscriber {
    update: (data: NewItemFormat) => Promise<boolean>
}

export class NewItemEvent extends EbayEvent<NewItemSubscriber>{
    async notify(newItems: NewItemFormat) {
        const outcomes: Promise<Boolean>[] = []
        for (const listener of this.listeners) {
            outcomes.push(listener.update(newItems))
        }
        let allOutcome = await Promise.allSettled(outcomes)
        allOutcome.map(o => {
            if (o.status === "fulfilled") {
                return o.value
            }
            return false
        })
        .every((value: Boolean) => value)

        if (allOutcome) {
            db.run(`
                update favouriteQueries 
                    set lastCheckedEpoch = unixepoch()
                where
                    id = $id 
            `, [newItems.id])
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
                    // console.group("Item")
                    // console.log("cte", createdTimeEpoch)
                    // console.log("lce", lastCheckedEpoch)
                    // console.groupEnd()
                    if (createdTimeEpoch >= lastCheckedEpoch) {
                        newItems.push(item)
                    } 
                }


                const data: NewItemFormat = {
                    "id": id,
                    "query": JSON.parse(ebaySearch),
                    "items": newItems
                }

                if (newItems.length) {
                    this.notify(data) 
                }
            })()
        }
    }
}
