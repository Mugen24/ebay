import { clearInterval, setInterval } from 'timers';
import { Setting } from "./setting/settings";
import { getItem, search } from "../EbayApi/EbayApi";
import { EbaySaverState } from "../EbayApi/EbaySaverState";
import { EbaySearchReturn } from "../types/EbayApiTypes/ebaySeachTypes";
import { FavouriteQueries, WatchItems, FavouriteQueriesData, WatchItemsData, SettingType, Favourite } from '../types/SettingType';
import logging from "../utils/logger";
import { setting } from './Init';


class SearchListener {
    // listeners: Array<(data: SearchConfigDataType) => void>
    _running: boolean
    timeout: number
    cached: boolean
    queries: FavouriteQueries
    items: WatchItems
    _interval?: any
    constructor(queries: FavouriteQueries, items: WatchItems) {
        // this.listeners = []
        this._running = false
        this.timeout = 6000
        this.cached = true
        this.queries = queries
        this.items = items 
    }

    start() {
        logging.debug("ListenerStart")
        for (const timeStamp of Object.keys(this.queries)) {
            const state =  this.queries[Number(timeStamp)].state
            setInterval(() => {
            }, 1000);

        }
    }


    stop() {
        logging.debug("ListenerStop")
        clearInterval(this._interval)
    }
}

const singletonSearchListener = new SearchListener(setting?.setting.favouriteQueries ?? {}, setting.setting.watchedItems ?? {})
export function getSearchListener() {
    return singletonSearchListener
}