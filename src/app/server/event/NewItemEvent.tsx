import { EbayEvent, EventData } from "./EbayEvent";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Database } from "sqlite";

export type NewItemFormat = {
    "id": string,
    "query": EbaySearch,
    "items": ItemSummary[]
}


export class NewItemEvent extends EbayEvent{
    db: Database
    constructor(db: Database) {
        super("NewItemEvent")
        this.db = db
    }

    async onSuccess(eventData: EventData) {
        const newItems = eventData.data

        const currDate = new Date(Date.now())
        logging.debug(`Updated time: ${currDate.toLocaleTimeString()}`)

        // set lastCheckedEpoch = unixepoch()
        this.db.run(`
            update favouriteQueries 
                set lastCheckedEpoch = ?
            where
                id = ?
        `, [currDate.getTime(), newItems.id])
    }

    addListener(title: string, callback: (newItemFormat: NewItemFormat) => Promise<boolean>): void {
        super.addListener(title, callback)
    }


    async mainLoop() {
        const queries = await this.db.all(`
            select id, lastCheckedEpoch, ebaySearch from favouriteQueries
        `)
        for (const query of queries) {
            (async () => {
                const {id, lastCheckedEpoch, ebaySearch} = query
                const [outcome, resp] = await ebayApi.search(JSON.parse(ebaySearch), {})
                if (!outcome) {
                    logging.error("Failed event fetch")
                    return
                }

                const newItems: ItemSummary[] = []
                for (const item of resp.itemSummaries) {
                    const createdTimeEpoch= new Date(item.itemCreationDate).getTime() 
                    if (createdTimeEpoch > lastCheckedEpoch) {
                           newItems.push(item)
                    } 
                    // newItems.push(item)
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
