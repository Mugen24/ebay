"use server"

import { EbaySearch } from "@/app/types/ebaySeachTypes";
import { readFileSync, writeFile } from "fs";
const PATH = "../../data/search/searchConfig.json"

export function saveConfig(ebaySearch: EbaySearch) {
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

export function loadConfig() {
    const fileContent = readFileSync(PATH, "utf-8")
    return fileContent as EbaySearch
}

