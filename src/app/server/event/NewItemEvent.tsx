import { EbayEvent } from "./EbayEvent";
import { db } from "@/app/layout";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
type ItemEvent = (items: ItemSummary[]) => void

export class NewItemEvent extends EbayEvent<ItemEvent> {
    async eventLoop() {
        const queries = await db.all(`
            select id, lastCheckedEpoch, ebaySearch from favouriteQueries
        `)
        for (const query of queries) {
            (async () => {
                const {id, lastCheckedEpoch, ebaySearch} = query
                const [outcome, resp] = await ebayApi.search(ebaySearch, {}, true)
                if (!outcome) {
                    logging.error("Failed event fetch")
                    return
                }

                const newItems: ItemSummary[] = []
                for (const item of resp.itemSummaries) {
                    const createdTimeEpoch= Date.parse(item.itemCreationDate) / 1000
                    if (createdTimeEpoch <= lastCheckedEpoch) {
                        break
                    } 
                    newItems.push(item)
                }

                this.notify(newItems) 
                await db.run(`
                    update favouriteQueries
                        set lastCheckedEpoch = ?
                    where
                        id = ?
                `, [Date.now(), id])

            })()
        }
    }


}