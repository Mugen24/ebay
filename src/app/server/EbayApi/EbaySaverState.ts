import { AspectFilter, BuyingOption, CompatibilityFilter, ConditionOption, EbaySearch, SortField } from '../../types/EbayApiTypes/ebaySeachTypes';
import logging from "../../utils/logger"


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
    "AU": "EBAY_AU",
    "US": "EBAY_US",
}


export interface SEbaySearch extends Omit<EbaySearch, 'fieldgroups'> {
    filter?: Record<string, any>
    fieldgroups?: Array<string>
}

export class EbaySaverState {
    static parse(searchState: SEbaySearch): EbaySearch{
        logging.info("Parsing searchState:", searchState)

        const q = searchState.q;
        const gtin = searchState.gtin;
        const charity_ids = searchState.charity_ids;
        const fieldgroups = searchState.fieldgroups ? searchState.fieldgroups.join(",") : undefined;
        const compatibility_filter = searchState.compatibility_filter;
        const auto_correct = searchState.auto_correct;
        const category_ids = searchState.category_ids;

        const filter = EbaySaverState.constructFilter(searchState).filter;

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
        ebaySearch.fieldgroups = ["ASPECT_REFINEMENTS", "CATEGORY_REFINEMENTS", "MATCHING_ITEMS"]
        return ebaySearch
    }

    static constructFilter(sEbaySearch: SEbaySearch): EbaySearch {
        const parsedEbaySearch: EbaySearch = {...sEbaySearch}

        const filter = parsedEbaySearch.filter ?? {}
        logging.debug("Constructing filter: \n", filter)
        if (!filter) return parsedEbaySearch

        // Already constructed
        if (filter instanceof String) return parsedEbaySearch

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
        parsedEbaySearch.filter = filterString
        return parsedEbaySearch
    }

    static setLocation(sEbaySearch: SEbaySearch, country: keyof typeof Countries) {
        const OPTION = "itemLocationCountry";
        // filter=itemLocationCountry:US

        logging.debug("Setting location:", country)
        if (!sEbaySearch["filter"]) {
            sEbaySearch["filter"] = {}
        }
        sEbaySearch["filter"]["itemLocationCountry"] = country
        return sEbaySearch
    }

    // Additional options: these are the options that needs to be passed via 
    // header

    // static makeUserAddressHeader(country: keyof typeof Countries, postcode: Number) {
    //     // TODO: implement a setting system and save this in setting
    //     country = country 
    //     postcode = postcode 

    //     return [
    //         "X-EBAY-C-ENDUSERCTX", `contextualLocation=${encodeURIComponent(`country=${country},zip=${postcode}`)}}`
    //     ]
    // }


}
