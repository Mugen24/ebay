'use client'
import { AspectFilter, BuyingOption, CompatibilityFilter, ConditionOption, EbaySearch, SortField } from "../types/ebaySeachTypes"
import { saveConfig, loadConfig } from "../server_components/saveState"

type ArrayElement<T> = T extends (infer U)[] ? U : never

export type Filter = {
    "buyingOptions": BuyingOption[]
    "conditions": ConditionOption[]
}

export class EbaySaverState {
    q?: string
    gtin?: string
    charity_ids?: string
    fieldgroups?: string
    compatibility_filter?: CompatibilityFilter
    auto_correct?: string
    category_ids?: string
    filter: Filter
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

        this.filter = {
            "buyingOptions": [],
            "conditions": []
        }

        if (searchState.filter) {
            this.deconstructFilter(searchState.filter);
        }

        if (!this.filter["buyingOptions"]) {
            this.filter["buyingOptions"] = []
        }
        else if (!this.filter["conditions"]) {
            this.filter["conditions"] = []
        }

        console.log("constructu: ---")
        console.log(this.filter)

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
        console.log("decon:")
        console.log(filter)
        const options: Record<string, string[]>= {};
        const [_ , filterOptions] = filter.split("=")
        // buyingOptions: .. | .. | .. , conditions: .. | .. | ..
        const params = filterOptions.split(",");
        for (const value of params) {
            let [paramKeyword, paramOptionsRaw] = value.split(":");
            paramOptionsRaw = paramOptionsRaw.replace("{", "")
            paramOptionsRaw = paramOptionsRaw.replace("}", "")
            // if option = "" or {} bf replacing
            if (paramOptionsRaw.length >= 0) {
                const paramOptions = paramOptionsRaw.split("|");
                if (Object.keys(this.filter).includes(paramKeyword)) {
                    const val = this.filter[paramKeyword as keyof Filter]
                    // @ts-ignore
                    this.filter[paramKeyword as keyof Filter] = val.concat(
                        // @ts-ignore
                        paramOptions.filter(op => !val.includes(op))
                    )
                }
            }
        }
        // return options
    }

    private constructFilter() {
        const filter = this.filter;
        console.log("construct:")
        console.log(filter)
        // let filterString = "";
        if (!filter || Object.keys(filter).length <= 0) {
            console.warn("No filter given");
            return "";
        }

        const optionStrings = [];
        console.log("here: ---------")
        console.log(filter)
        for (const key in filter) {
            const optionValues: string | undefined = filter[key as keyof Filter]?.join('|');
            optionStrings.push(`${key}:{${optionValues}}`);
        }

        let filterString = "filter=";
        filterString += optionStrings.join(',');
        return filterString;
    }

    // TODO: fix the stupid type 
    addUniqueFilter<K extends keyof Filter>(filterKey: K, filterValue: ArrayElement<Filter[K]>, clear: Boolean) {
        if (!clear) {
            clear = false
        } 

        const value = this.filter[filterKey];
        // @ts-ignore
        if (clear) {
            // @ts-ignore
            this.filter[filterKey] = [filterValue]
        } else {
            // @ts-ignore
            if (!value.includes(filterValue)){
                // @ts-ignore
                this.filter[filterKey].push(filterValue!)
            }
        }

    }
    // TODO: fix the stupid type 
    addUniqueFilters<K extends keyof Filter>(filterKey: K, filterValues: Filter[K], clear: Boolean) {
        if (!clear) {
            clear = false
        } 

        const value = this.filter[filterKey];
        // @ts-ignore
        const temp = filterValues.filter(f => !value.includes(f))
        // @ts-ignore
        if (clear) {
            // @ts-ignore
            this.filter[filterKey] = temp
        } else {
            // @ts-ignore
            this.filter[filterKey] = value.concat(temp)
        }
    }

    toJSON(): EbaySearch {
        const temp: Record<string, any> = {
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
            if (!temp[key]) {
                delete temp[key]
            }
        }
        return temp
    }

    toSearchParams(): URLSearchParams{
        return new URLSearchParams(this.toJSON() as Record<string, string>)
    }

    saveToConfig() {
        saveConfig(this.toJSON())
    }
    readConfig() {
        return loadConfig()
    }

}
