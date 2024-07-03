"use server"

import { formToJSON } from "axios"
import { Ebay } from "../api/ebay/ebay"
import { EbaySearch } from "../types/ebaySeachTypes"
import { EbaySearchConfig } from "../EbayItem"
import { readFile } from "fs/promises"
import { PATH } from "../utils"
import { writeFile } from "fs"

const promiseEbay = Ebay.authenticate();

export async function saveParamsToConfig(config: EbaySearch) {
    const fileContent = await readFile(PATH, "utf-8");
    const localConfig = JSON.parse(fileContent);
    localConfig["searchParams"]["q"] = config

    writeFile(PATH, JSON.stringify(localConfig, undefined, 4), "utf-8", (err) => {
        if (err) {
            console.error(err)
        }
    })
}

export async function ebaySearch(config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);
    const ebay = await promiseEbay;
    const data = await ebay.search(ebayConfig);
    return data;
}

export async function searchRaw(url: string) {
    const ebay = await promiseEbay;
    console.log(url);
    const data = await ebay.search(url);
    return data;
}

export async function search(formData: FormData) {
    const queries: EbaySearch = formToJSON(formData)
    queries["fieldgroups"] = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"

    const config = new EbaySearchConfig()
    config.setParams(queries)
    const ebay = await promiseEbay;
    const data = await ebay.search(config)
    return data
}

export async function refineCategoryItemCall(categories_id: string, config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);

    ebayConfig.addEntry( "category_ids",categories_id);

    const ebay = await promiseEbay;
    const data = await ebay.search(ebayConfig);
    return data;
}


export async function handleSort(value: string , config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);
    ebayConfig.addEntry("sort", value);

    const ebay = await promiseEbay;
    const data = await ebay.search(ebayConfig);
    return data;
}

export async function handleType(value: string, config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);

    ebayConfig.addEntry("filter", value)
    const ebay = await promiseEbay;
    const data = await ebay.search(ebayConfig);
    return data

}
