'use client'
import { search } from "../EbayApi/EbayApi"
import { searchAction } from "../EbayApi/EbayApiAction"
import { AspectFilter, CompatibilityFilter, EbaySearch, SortField } from "../types/ebaySeachTypes"
import { saveConfig, loadConfig } from "./saveState"

export class EbaySaverState {
    q?: string
    gtin?: string
    charity_ids?: string
    fieldgroups?: string
    compatibility_filter?: CompatibilityFilter
    auto_correct?: string
    category_ids?: string
    filter?: Record<string, string[]>
    sort?: SortField
    limit?: string
    offset?: string
    aspect_filter?: AspectFilter
    epid?: string

    constructor(searchState: EbaySearch) {
        // this.data = JSON.parse(JSON.stringify(searchState))
        if (!searchState.q) {
            throw new Error("'q' params is required")
        }
        this.q = searchState.q;

        this.gtin = searchState.gtin;
        this.charity_ids = searchState.charity_ids;
        this.fieldgroups = searchState.fieldgroups;
        this.compatibility_filter = searchState.compatibility_filter;
        this.auto_correct = searchState.auto_correct;
        this.category_ids = searchState.category_ids;

        if (searchState.filter) {
            this.filter = this.deconstructFilter(searchState.filter);
        } else {
            console.warn("No filter args given")
        }

        this.sort = searchState.sort;
        this.limit = searchState.limit;
        this.offset = searchState.offset;
        this.aspect_filter = searchState.aspect_filter;
        this.epid = searchState.epid;

        // this.toJson.bind(this)
    }

    addCategoryRequest() {
        this.fieldgroups = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"
    }
    removeCategoryRequest() {
        this.fieldgroups = ""
    }

    private deconstructFilter(filter: string) {
        // filter=buyingOptions:FIXED_PRICE|AUCTION|BEST_OFFER,conditions:NEW|USED
        const options: Record<string, string[]>= {};
        const [_ , filterOptions] = filter.split("=")
        // buyingOptions: .. | .. | .. , conditions: .. | .. | ..
        const params = filterOptions.split(",");
        for (const value of params) {
            const [paramKeyword, paramOptionsRaw] = value.split(":");
            const paramOptions = paramOptionsRaw.split("|");
            options[paramKeyword] = paramOptions
        }
        return options
    }

    private constructFilter() {
        const filter = this.filter;
        // let filterString = "";
        if (!filter) {
            console.warn("No filter given");
            return "";
        }

        const optionStrings = [];
        for (const key in filter) {
            const optionValues = filter[key].reduce((a,b) => `${a}|${b}`);
            optionStrings.push(`${key}:{${optionValues}}`);
        }

        let filterString = "filter=";
        filterString += optionStrings.reduce((a,b) => `${a},${b}`);
        return filterString;
    }

    toJson(): EbaySearch {
        const temp: EbaySearch = {
            "q": this.q,
            "gtin": this.gtin,
            "charity_ids": this.charity_ids,
            "fieldgroups": this.fieldgroups,
            "compatibility_filter": this.compatibility_filter,
            "auto_correct": this.auto_correct,
            "category_ids": this.category_ids,
            "filter": this.constructFilter(),
            "sort": this.sort,
            "limit": this.limit,
            "offset": this.offset,
            "aspect_filter": this.aspect_filter,
            "epid": this.epid
        }

        for (const key in temp) {
            if (!temp[key as keyof typeof temp]) {
                delete temp[key as keyof typeof temp]
            }
        }
        return temp
    }

    toSearchParams(): URLSearchParams{
        return new URLSearchParams(this.toJson() as Record<string, string>)
    }

    saveToConfig() {
        saveConfig(this.toJson())
    }
    readConfig() {
        return loadConfig()
    }

    search() {
        return search(this.toJson())
    }
}
