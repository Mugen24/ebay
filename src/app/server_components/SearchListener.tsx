import { setTimeout } from "timers/promises";
import { search } from "../EbayApi/EbayApi";
import { EbaySearch, ItemSummary } from "../types/EbayApiTypes/ebaySeachTypes";
import { readFileSync, writeFile } from "fs";
import { SearchConfigType } from "../types/searchConfigType";
import path from "path";

"/home/mugen/Programing/ebay/.next/server/app"
const PATH = "../../../src/app/data/searchConfig.json"
type searchString = string
export type SearchConfigDataType = Record<searchString, ItemSummary[]>

async function sleep(second: number) {
    return new Promise((res) => setTimeout(second * 1000, res))
}

export async function saveConfig(ebaySearch: EbaySearch) {
    const fileContent = readFileSync(path.resolve(__dirname, PATH), "utf-8");
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
    console.log(__dirname)
    const fileContent = JSON.parse(readFileSync(path.resolve(__dirname, PATH), "utf-8"))
    return fileContent as SearchConfigType
}

class SearchListener {
    listeners: Array<(data: SearchConfigDataType) => void>
    _running: boolean
    timeout: number
    cached: boolean
    constructor() {
        this.listeners = []
        this._running = false
        this.timeout = 6000
        this.cached = true
    }
    static _hash_item(item: ItemSummary) {
        return `${item.epid+item.itemId}`
    }

    compareCache(data: SearchConfigDataType, lastRunTime: EpochTimeStamp) {
        const searchTerms = Object.keys(data)
        for (const searchTerm of searchTerms) {
            data[searchTerm].filter(item => {
                const dateCreated = new Date(item.itemCreationDate).valueOf()
                return (dateCreated - lastRunTime > 0) 
            })

        }

        return data
    }

    async search(searchConfig: SearchConfigType): Promise<SearchConfigDataType> {
        let perConfigData: SearchConfigDataType = {}
        for (const [searchTerm, searchParam] of Object.entries(searchConfig.searchParams)) {
            const resp = await search(searchParam) 
            const itemDatas = resp.itemSummaries

            perConfigData[searchParam.q] = itemDatas
        }

        if (this.cached) {
            perConfigData = this.compareCache(perConfigData, searchConfig.lastRunTime)
        }
        return perConfigData
    }

    async start() {
        this._running = true
        let initialData = true
        while (this._running) {
            let data: SearchConfigDataType
            if (initialData) {
                data = await this.oneOffSearch()    
                initialData = false
            }
            else {
                const searchConfig = await loadConfig();
                data = await this.search(searchConfig)
            }

            for (const listener of this.listeners) {
                listener(data)
            }
            await sleep(this.timeout)
        }
    }

    async oneOffSearch(): Promise<SearchConfigDataType> {
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