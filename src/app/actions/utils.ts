import path from "path";
import { EbaySearchReturn } from "../types/EbayApiTypes/ebaySeachTypes";

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
    if (!data) {
        return []
    }
    return data
}