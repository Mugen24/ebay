import { setTimeout } from "timers/promises";
import { search } from "../EbayApi/EbayApi";
import { ItemSummary } from "../types/ebaySeachTypes";
import { EbaySearch } from "@/app/types/ebaySeachTypes";
import { readFileSync, writeFile } from "fs";
import { SearchConfigType } from "../data/searchConfigType";

const PATH = "../../data/search/searchConfig.json"
type searchString = string
export type SearchConfigDataType = Record<searchString, ItemSummary[]>

async function sleep(second: number) {
    return new Promise((res) => setTimeout(second * 1000, res))
}

export async function saveConfig(ebaySearch: EbaySearch) {
    const fileContent = readFileSync(PATH, "utf-8");
    const localConfig: SearchConfigType | undefined = JSON.parse(fileContent);
    const epochTime = Date.now()
    let newConfig: SearchConfigType 

    if (!localConfig) {
        //Default structure
        newConfig = {
            "searchParams": [ebaySearch],
            "lastRunTime": epochTime
        }
    } else {
        newConfig = localConfig
        newConfig["searchParams"].push(ebaySearch)
        newConfig["lastRunTime"] = epochTime
    }

    writeFile(PATH, JSON.stringify(localConfig, undefined, 4), "utf-8", (err) => {
        if (err) {
            console.error(err)
        }
    })
}

export async function loadConfig() {
    const fileContent = JSON.parse(readFileSync(PATH, "utf-8"))
    return fileContent as SearchConfigType
}

class SearchListener {
    listeners: Array<(data: SearchConfigDataType) => void>
    _running: boolean
    timeout: number
    cached: boolean
    /*
        {
            searchTerm: {
                "epid+itemId": true
            }
        }
    */
    _cached_info: Record<searchString, Record<string, true>>
    constructor() {
        this.listeners = []
        this._running = false
        this.timeout = 6000
        this.cached = true
        this._cached_info = {}
    }
    static _hash_item(item: ItemSummary) {
        return `${item.epid+item.itemId}`
    }

    compareCache(data: SearchConfigDataType) {
        const searchTerms = Object.keys(data)
        for (const searchTerm of searchTerms) {
            const searchCache = this._cached_info[searchTerm]
            if (!searchCache) {
                const keyHashDict: any = {}
                for (const item of data[searchTerm]) {
                    keyHashDict[SearchListener._hash_item(item)] = true
                }
                this._cached_info[searchTerm] = keyHashDict

            } else {
                data[searchTerm].filter(item => {
                    return this._cached_info[searchTerm][SearchListener._hash_item(item)] 
                })
            }

        }

        return data
    }

    async search(searchConfig: SearchConfigType): Promise<SearchConfigDataType> {
        const perConfigData: SearchConfigDataType = {}
        for (const perConfig of searchConfig.searchParams) {
            const resp = await search(perConfig) 
            const itemDatas = resp.itemSummaries

            perConfigData[perConfig.q] = itemDatas
        }

        const filteredData = this.compareCache(perConfigData)
        return filteredData
    }

    async start() {
        this._running = true
        while (this._running) {
            const searchConfig = await loadConfig();
            const data = await this.search(searchConfig)
            for (const listener of this.listeners) {
                listener(data)
            }
            await sleep(this.timeout)
        }
    }

    async oneOffSearch() {
        const searchConfig = await loadConfig();
        const data = await this.search(searchConfig)
        return data
    }

    stop() {
        this._running = false
    }
}

const singletonSearchListener = new SearchListener()

export function getSearchListener() {
    return singletonSearchListener
}