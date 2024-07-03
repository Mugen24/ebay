"use server"

import { formToJSON } from "axios"
import { Ebay, EbaySearchConfig } from "../api/ebay/ebay"
import { EbaySearch } from "../types/ebaySeachTypes"

const ebay = await Ebay.authenticate()

export async function search(formData: FormData) {
    const queries: EbaySearch = formToJSON(formData)
    queries["fieldgroups"] = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"

    const config = new EbaySearchConfig()
    config.setParams(queries)
    const data = await ebay.search(config)
    return data
}

export async function refineCategoryItemCall(categories_id: string, config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);

    ebayConfig.addEntry( "category_ids",categories_id);

    const data = await ebay.search(ebayConfig);
    return data;
}


export async function handleSort(value: string , config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);
    ebayConfig.addEntry("sort", value);

    const data = await ebay.search(ebayConfig);
    return data;
}

export async function handleType(value: string, config: EbaySearch) {
    const ebayConfig = new EbaySearchConfig();
    ebayConfig.setParams(config);

    ebayConfig.addEntry("filter", value)
    const data = await ebay.search(ebayConfig);
    return data

}
