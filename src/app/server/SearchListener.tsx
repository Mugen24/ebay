import { clearInterval, setInterval } from 'timers';
import { Favourite, FavouriteQueryData, WatchItemData, WatchItem, WatchItems, EbayItemId, FavouriteQueries } from '../types/SettingType';
import logging from "../utils/logger";
import { clientApiManager } from '../utils/clientApiManager';


abstract class SearchListener<T, M> {
    abstract query: T
    abstract listeners: Array<(data: M) => void>
    _running: boolean = false
    timeout: number
    _interval?: any
    constructor(timeout: number) {
        this.timeout = timeout
    }

    abstract run(data: T): M 

    addListener(listener: (data: M) => void) {
        this.listeners.push(listener)
    }

    start() {
        logging.debug("ListenerStart")
        this._running = true
        setInterval(() => {
            const data = this.run(this.query)
            this.listeners.forEach(l => l(data))
        }, this.timeout);
    }


    stop() {
        logging.debug("ListenerStop")
        clearInterval(this._interval)
        this._interval = undefined
        this._running = false
    }
}

class EbaySearchListener extends SearchListener<Favourite, Promise<FavouriteQueryData | undefined>> {
    query: Favourite
    listeners: ((data: Promise<FavouriteQueryData | undefined>) => void)[];
    constructor(ebaySearch: Favourite) {
        super(ebaySearch.refreshIntervalSecond)
        this.query = ebaySearch
        this.listeners = []
    }

    async run(): Promise<FavouriteQueryData | undefined> {
        return clientApiManager.search(this.query.state)
        .then(([outcome, resp])=> {
            if (outcome) {
                return [this.query.id, resp]
            } else {
                return undefined
            }
        })
    }
}

class EbayItemListener extends SearchListener<WatchItem, Promise<WatchItemData | undefined>> {
    query: WatchItem
    listeners: ((data: Promise<WatchItemData| undefined>) => void)[];
    constructor(ebayGetItem: WatchItem) {
        super(ebayGetItem.refreshIntervalSecond)
        this.listeners = []
        this.query = ebayGetItem
    }

    async run(): Promise<WatchItemData | undefined>{
        return clientApiManager.getItem(this.query.itemData)
        .then(([outcome, resp]) => {
            if (outcome) {
                return [this.query.id, resp]
            } else {
                return undefined
            }
        })
    }
}

export class EbayItemListeners {
    sources: Record<WatchItem["id"], EbayItemListener> = {}
    constructor(watchItems: WatchItems) {
        for (const item of Object.values(watchItems)) {
            this.sources[item.id] = (new EbayItemListener(item))
        }
    }

    addListener(listener: ((data: Promise<WatchItemData| undefined>) => void)) {
        for (const source of Object.values(this.sources)) {
            source.addListener(listener)
        }
    }

    run() {
        for (const source of Object.values(this.sources)) {
            source.run()
        }
    }
    stop() {
        for (const source of Object.values(this.sources)) {
            source.stop()
        }
    }

    remove(id: EbayItemId) {
        this.sources[id].stop()
        delete this.sources[id]
    }
}

export class EbaySearchListeners{
    sources: Record<Favourite["id"], EbaySearchListener> = {}
    constructor(fItems: FavouriteQueries) {
        for (const item of Object.values(fItems)) {
            this.sources[item.id] = (new EbaySearchListener(item))
        }
    }

    addListener(listener: ((data: Promise<FavouriteQueryData | undefined>) => void)) {
        for (const source of Object.values(this.sources)) {
            source.addListener(listener)
        }
    }

    run() {
        for (const source of Object.values(this.sources)) {
            source.run()
        }
    }
    stop() {
        for (const source of Object.values(this.sources)) {
            source.stop()
        }
    }

    remove(id: Favourite["id"]) {
        this.sources[id].stop()
        delete this.sources[id]
    }
}

