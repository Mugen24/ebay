import { AgeGroup, EbayGetItemReturn } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import { EbayEvent } from "./EbayEvent";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { setTimeout } from "timers/promises";
import { TimeUtil } from "@/app/utils/time";
import { Database } from "sqlite";
import type { Favourite } from "../setting/favourite";


export type ItemWatchListenerType = {
    id: string
    ebayGetItemReturn: EbayGetItemReturn
}

export interface ItemWatchListener {
    update: (item: ItemWatchListenerType) => Promise<boolean>
}


export class ItemWachEvent extends EbayEvent<ItemWatchListener> {
    favourite: Favourite
    constructor(favourite: Favourite) {
        super()
        this.favourite = favourite
    }

    async setupAuctionEndingEvent(newItem: ItemWatchListenerType) {
        const timerTrigger = 10 * 60 * 1000 //mins
        const item = newItem.ebayGetItemReturn
        if (
            item
            .buyingOptions.includes("Auction" as AgeGroup)
        ) {
            const endDate = new Date(item.itemEndDate)
            const dateDelta = TimeUtil.timeLeft(new Date(), endDate)
            const miliseconds = TimeUtil.convertToMilisecond(dateDelta)
            setTimeout(miliseconds - timerTrigger, this.notify(newItem))
        }
    }

    async notify(newItem: ItemWatchListenerType): Promise<void> {
        const outcome = []
        for (const listener of this.listeners) {
            outcome.push(listener.update(newItem))
        }

        if (outcome.every(o => o)) {
            // Doesn't really do any update for now             
        }
    }

    async mainLoop() {
        logging.debug("ItemWatchListener")

        const favItems = await this.favourite.getItems()

        for (const item of favItems) {
            const [outcome, data] = await ebayApi.getItem({
                item_id: item.ebayItem.itemId,
                fieldgroups: "COMPACT"
            })

            if (!outcome) {
                logging.error("Watcher[getItem]", data)
            }
            else {
                this.notify({
                    id: item.id,
                    ebayGetItemReturn: data
                })
            }
        }
    }

}
