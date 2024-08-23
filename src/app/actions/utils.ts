import { ItemSummary } from "../types/ebaySeachTypes"
import config from "../data/searchConfig.json"
import path from "path";
import { EbaySearchReturn } from "../types/ebaySeachTypes";

export const PATH = path.resolve("src/app/data/searchConfig.json");
export function formToJson(form: FormData) {
    const jsonForm: Record<string, FormDataEntryValue> = {}
    for (const [key, value] of form.entries()) {
        jsonForm[key] = value
    }
    return jsonForm
}

export function URLSearchParamsToJson(params: URLSearchParams) {
    const data: Record<string, any> = {}
    for (const [key, value] of params) {
        data[key] = value
    }
    return data
}

//fromDate instead of just Date.now() in case of checking  
//date from the past
export function checkNewListing(item: ItemSummary, fromDate?: Date) {
    let date;
    if (fromDate === undefined) {
        if (config["lastRunTime"]){
            date = new Date(config["lastRunTime"])
        } else {
            date = new Date(Date.now())
        }
    } else {
        date = fromDate
    }

    date.setHours(0)

    const itemDate = new Date(item.itemCreationDate);
    const minnuteOffset = itemDate.getTimezoneOffset();

    //Offset the UTC time
    return (itemDate.getTime() + (minnuteOffset * 60) >= date.getTime())
}

//EbaySearchReturn related helper
export function extractCategoryDistributions(result: EbaySearchReturn) {
    const categories = result["refinement"]?.["categoryDistributions"];
    console.log("Categories extracted")
    console.log(categories)
    if (!categories) {
        return []
    } 
    return categories
}

export function extractItems(result: EbaySearchReturn) {
    const data = result["itemSummaries"];
    console.log("extracted items")
    console.log(data)
    if (!data) {
        return []
    }
    return data
}