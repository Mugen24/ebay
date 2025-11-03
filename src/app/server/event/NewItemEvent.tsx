import { EbayEvent } from "./EbayEvent";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Database } from "sqlite";

export type NewItemFormat = {
    "id": string,
    "query": EbaySearch,
    "items": ItemSummary[]
}

export interface NewItemSubscriber {
    update: (data: NewItemFormat) => Promise<boolean>
}

export class NewItemEvent extends EbayEvent<NewItemSubscriber>{
    db: Database
    constructor(db: Database) {
        super()
        this.db = db
    }

    async notify(newItems: NewItemFormat) {
        const outcomes: Promise<Boolean>[] = []
        for (const listener of this.listeners) {
            outcomes.push(listener.update(newItems))
        }
        let allOutcome = await Promise.allSettled(outcomes)
        const outcome = allOutcome.map(o => {
            if (o.status === "fulfilled") {
                return o.value
            }
            return false
        })
        .every((value: Boolean) => value)

        logging.group("NewItemEvent:")
        logging.debug(`Outcome: ${outcome}`)
        // logging.debug(`Data: ${JSON.stringify(newItems)}`)

        if (outcome) {
            const currDate = new Date(Date.now())
            logging.debug(`Updated time: ${currDate.toUTCString()}`)

            // set lastCheckedEpoch = unixepoch()
            this.db.run(`
                update favouriteQueries 
                    set lastCheckedEpoch = ?
                where
                    id = ?
            `, [currDate.getTime(), newItems.id])
        }

        logging.groupEnd()

    }

    async mainLoop() {
        const queries = await this.db.all(`
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
                    const createdTimeEpoch= new Date(item.itemCreationDate).getTime() 
                    if (createdTimeEpoch >= lastCheckedEpoch) {
                           newItems.push(item)
                    } 
                    newItems.push(item)
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
