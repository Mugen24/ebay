'use client'
import { AspectFilter, CompatibilityFilter, EbaySearch, EbaySearchReturn, FilterField, SortField } from "../types/ebaySeachTypes"
import { saveConfig, loadConfig } from "./saveState"

type EbaySearchKey = keyof EbaySearch
export class EbaySaverState {
    q?: string
    gtin?: string
    charity_ids?: string
    fieldgroups?: string
    compatibility_filter?: CompatibilityFilter
    auto_correct?: string
    category_ids?: string
    filter?: string[]
    sort?: SortField
    limit?: string
    offset?: string
    aspect_filter?: AspectFilter
    epid?: string

    constructor(searchState: EbaySearch) {
        // this.data = JSON.parse(JSON.stringify(searchState))
        this.q = searchState.q;
        this.gtin = searchState.gtin;
        this.charity_ids = searchState.charity_ids;
        this.fieldgroups = searchState.fieldgroups;
        this.compatibility_filter = searchState.compatibility_filter;
        this.auto_correct = searchState.auto_correct;
        this.category_ids = searchState.category_ids;

        this.filter = searchState.filter;

        this.sort = searchState.sort;
        this.limit = searchState.limit;
        this.offset = searchState.offset;
        this.aspect_filter = searchState.aspect_filter;
        this.epid = searchState.epid;
    }


    private handleFilter(filter: string) {
        // filter=buyingOptions:FIXED_PRICE|AUCTION|BEST_OFFER,conditions:NEW|USED
        const [filterKeyword, options] = filter.split("=")


    }

    toJson() {
    }

    toSearchParams() {
    }

    readCurrentState() {
        // return this.data
    }

    saveToConfig() {
        // saveConfig(this.data)
    }
    readConfig() {
        // return loadConfig()
    }
}
