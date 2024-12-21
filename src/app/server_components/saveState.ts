"use server"

import { EbaySearch } from "@/app/types/ebaySeachTypes";
import { readFileSync, writeFile } from "fs";
const PATH = "../../data/search/searchConfig.json"

export async function saveConfig(ebaySearch: EbaySearch) {
    const fileContent = readFileSync(PATH, "utf-8");
    const localConfig = JSON.parse(fileContent);
    if (localConfig["ebaySearch"] === undefined) {
        localConfig["ebaySearch"] = [];
    }
    localConfig["ebaySearch"].push(JSON.stringify(ebaySearch, null, 4)) 

    writeFile(PATH, JSON.stringify(localConfig, undefined, 4), "utf-8", (err) => {
        if (err) {
            console.error(err)
        }
    })
}

export async function loadConfig() {
    const fileContent = readFileSync(PATH, "utf-8")
    return fileContent as EbaySearch
}


export async function fetchSavedSearches() {
    const searches: Array<Record<string, string>> = []

    for (const searchParam of Object.values(config["searchParams"])) {
        searches.push(searchParam);
    }

    config.lastRunTime = new Date(Date.now()).toISOString()
    try {
        writeFile(PATH, JSON.stringify(config))
    }
    catch (e) {
        console.log(e)
    }

    return searches;
}