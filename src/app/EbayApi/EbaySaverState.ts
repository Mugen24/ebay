'use client'
import { INSTRUMENTATION_HOOK_FILENAME } from 'next/dist/lib/constants';
import { AspectFilter, BuyingOption, CompatibilityFilter, ConditionOption, EbaySearch, SortField } from '../types/EbayApiTypes/ebaySeachTypes';
import logging from "../utils/logger"
import { List } from 'postcss/lib/list';
import { countReset } from 'console';


export type Filter = {
    "buyingOptions": BuyingOption[]
    "conditions": ConditionOption[]
}

const MULTI_OPTIONS= [
    "buyingOptions",
    "conditions"
]
const SINGLE_OPTIONS = [
    "itemLocationCountry"
]

export const Countries = {
    // More valid country code
    "AU": "AU",
    "US": "US",
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
        ebaySearch.fieldgroups = ""
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

        // Already constructed
        if (filter instanceof String) return sEbaySearch

        if (Object.keys(filter).length <= 0) {
            logging.warn("Empty filter");
            sEbaySearch.filter = ""
            return sEbaySearch
        }

        const optionStrings = [];
        for (const param in filter) {
            if (MULTI_OPTIONS.includes(param)) {
                const optionValues: string | undefined = filter[param as keyof Filter]?.join('|');
                optionStrings.push(`${param}:{${optionValues}}`);
            } else if (SINGLE_OPTIONS.includes(param)){
                optionStrings.push(`${param}:${filter[param]}`)
            } else {
                logging.warn("Unknown option: ",param)
            }
        }

        let filterString = "";
        filterString += optionStrings.join(',');
        sEbaySearch.filter = filterString
        return sEbaySearch
    }

    // TODO: fix the stupid type 
    static addUniqueFilter(sEbaySearch: SEbaySearch, filterKey: any, filterValue: any, clear: Boolean = false, toggle = false) {
        logging.debug("Adding unique filter\n", sEbaySearch.filter, filterKey, filterValue)
        const filter = sEbaySearch.filter ?? {}
        if (MULTI_OPTIONS.includes(filterKey)) {
            if (!filter[filterKey] || clear) {
                filter[filterKey] = [filterValue]
            }
            else {
                if (!Object.values(filter[filterKey]).includes(filterValue)){
                    filter[filterKey].push(filterValue!)
                } else if (toggle) {
                    const index = filter[filterKey].indexOf(filterValue)
                    delete filter[filterKey][index]
                }
            }
        }
        else if (SINGLE_OPTIONS.includes(filterKey)) {
            // if (!filter[filterKey] || clear) {
            //     filter[filterKey] = filterValue
            // } 
            filter[filterKey] = filterValue
        }

        sEbaySearch.filter = filter
        logging.debug("New filter", filter)
        return sEbaySearch
    }

    static toSearchParams(ebaySearch: SEbaySearch): URLSearchParams{
        ebaySearch = EbaySaverState.constructFilter({...ebaySearch})
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

    static setLocation(sEbaySearch: SEbaySearch, country: keyof typeof Countries) {
        const OPTION = "itemLocationCountry";
        // filter=itemLocationCountry:US

        logging.debug("Setting location:", country)
        return EbaySaverState.addUniqueFilter(sEbaySearch, OPTION, country)
    }

    // Additional options: these are the options that needs to be passed via 
    // header

    static getUserAddressHeader(country: keyof typeof Countries, postcode: Number) {
        // TODO: implement a setting system and save this in setting
        country = country 
        postcode = postcode 

        return [
            "X-EBAY-C-ENDUSERCTX", `contextualLocation=${encodeURIComponent(`country=${country},zip=${postcode}`)}}`
        ]
    }


}
