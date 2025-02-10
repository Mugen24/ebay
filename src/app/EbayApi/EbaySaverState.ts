'use client'
import { AspectFilter, BuyingOption, CompatibilityFilter, ConditionOption, EbaySearch, SortField } from '../types/EbayApiTypes/ebaySeachTypes';
import logging from "../utils/logger"


export type Filter = {
    "buyingOptions": BuyingOption[]
    "conditions": ConditionOption[]
}

export interface SEbaySearch extends EbaySearch {}

export class EbaySaverState {
    static parse(searchState: EbaySearch): SEbaySearch {
        logging.info("Parsing searchState:", searchState)
        // this.data = JSON.parse(JSON.stringify(searchState))
        if (!searchState.q) {
            throw new Error("'q' params is required")
        }

        const q = searchState.q;
        const gtin = searchState.gtin;
        const charity_ids = searchState.charity_ids;
        const fieldgroups = searchState.fieldgroups;
        const compatibility_filter = searchState.compatibility_filter;
        const auto_correct = searchState.auto_correct;
        const category_ids = searchState.category_ids;

        const filter = EbaySaverState.deconstructFilter(searchState).filter;

        const sort = searchState.sort;
        const limit = searchState.limit;
        const offset = searchState.offset;
        const aspect_filter = searchState.aspect_filter;
        const epid = searchState.epid;

        const temp: any = {
            q,
            gtin,
            charity_ids,
            fieldgroups,
            compatibility_filter,
            auto_correct,
            category_ids,
            filter,
            sort,
            limit,
            offset,
            aspect_filter,
            epid
        }

        for (const key in temp) {
            if (!temp[key]) {
                delete temp[key]
            }
        }
        return temp
    }

    static addCategoryRequest(ebaySearch: SEbaySearch) {
        ebaySearch.fieldgroups = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"
        return ebaySearch
    }
    static removeCategoryRequest(ebaySearch: SEbaySearch) {
        ebaySearch.fieldgroups = undefined
        return ebaySearch
    }

    static deconstructFilter(ebaySearch: EbaySearch) {
        // filter=buyingOptions:FIXED_PRICE|AUCTION|BEST_OFFER,conditions:NEW|USED
        let filter = ebaySearch.filter
        logging.debug("Deconstructing Filter \n:", filter)
        if (!filter) {
            ebaySearch.filter = {}
            return ebaySearch
        }

        const options: Record<string, string[]>= {};
        const [_ , filterOptions] = filter.split("=")
        // buyingOptions: .. | .. | .. , conditions: .. | .. | ..
        const params = filterOptions.split(",");
        for (const param of params) {
            const key_value_matcher = /(?:(\w+):\W?([a-zA-Z|_]+)\W?)/;
            const match = param.match(key_value_matcher)
            if (match && match.length > 3) {
                options[match[1]] = match[2].split("|")
            } else {
                logging.error("Unable to parse filter")
                return ebaySearch
            }
        }
        // return options
        logging.debug("Result\n", options)
        ebaySearch.filter = options
        return ebaySearch
    }

    static constructFilter(sEbaySearch: SEbaySearch): EbaySearch {
        const filter = sEbaySearch.filter
        logging.debug("Constructing filter: \n", filter)
        if (!filter) return sEbaySearch
        if (Object.keys(filter).length <= 0) {
            logging.warn("Empty filter");
            return "";
        }

        const optionStrings = [];
        for (const param in filter) {
            const optionValues: string | undefined = filter[param as keyof Filter]?.join('|');
            optionStrings.push(`${param}:{${optionValues}}`);
        }

        let filterString = "filter=";
        filterString += optionStrings.join(',');

        sEbaySearch.filter = filterString
        return sEbaySearch
    }

    // TODO: fix the stupid type 
    static addUniqueFilter(sEbaySearch: SEbaySearch, filterKey: any, filterValue: any, clear: Boolean = false) {
        const filter = sEbaySearch.filter
        if (!filter) return sEbaySearch
        if (clear) {
            filter[filterKey] = [filterValue]
        } else {
            if (filter.includes(filterValue)){
                filter[filterKey].push(filterValue!)
            }
        }
    }

    static toSearchParams(ebaySearch: SEbaySearch): URLSearchParams{
        ebaySearch = EbaySaverState.constructFilter(ebaySearch)
        logging.debug("Converting search param\n", ebaySearch)
        return new URLSearchParams(ebaySearch as unknown as Record<string, any>)
    }

    static saveToConfig(ebaySearch: SEbaySearch) {
        throw new Error("Not implemented")
        //saveConfig(ebaySearch)
    }

    static readConfig(): SEbaySearch {
        throw new Error("Not implemented")
        // return loadConfig()
    }

}
