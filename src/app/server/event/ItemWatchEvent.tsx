import { AgeGroup, EbayGetItemReturn } from "@/app/types/EbayApiTypes/ebayGetItemTypes";
import { EbayEvent } from "./EbayEvent";
import { ebayApi } from "../EbayApi/EbayApi";
import logging from "@/app/utils/logger";
import { setTimeout } from "timers/promises";
import { TimeUtil } from "@/app/utils/time";
import { Database } from "sqlite";
import type { Favourite } from "../setting/favourite";


type NotifyType = {
    id: string
    ebayGetItemReturn: EbayGetItemReturn
}

type ItemWatchListenerType = (payload: NotifyType) => Promise<boolean>


export class ItemWatchEvent extends EbayEvent {
    favourite: Favourite
    constructor(favourite: Favourite) {
        super("ItemWatchEvent")
        this.favourite = favourite
    }

    // async setupAuctionEndingEvent(newItem: ItemWatchListenerType) {
    //     const timerTrigger = 10 * 60 * 1000 //mins
    //     const item = newItem.ebayGetItemReturn
    //     if (
    //         item
    //         .buyingOptions.includes("Auction" as AgeGroup)
    //     ) {
    //         const endDate = new Date(item.itemEndDate)
    //         const dateDelta = TimeUtil.timeLeft(new Date(), endDate)
    //         const miliseconds = TimeUtil.convertToMilisecond(dateDelta)
    //         setTimeout(miliseconds - timerTrigger, this.notify(newItem))
    //     }
    // }

    async addListener(title: string, callback: ItemWatchListenerType) {
        super.addListener(title, callback)
    }

    async mainLoop() {
        const favItems = await this.favourite.getItems()
        for (const item of favItems) {
            const [outcome, data] = await ebayApi.getItem({
                item_id: item.ebayItem.itemId,
                fieldgroups: "PRODUCT"
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
