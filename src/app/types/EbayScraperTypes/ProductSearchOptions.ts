export enum conditionIds {
    USED = 3000
}

export type ProductSearchOptions = {
    keywords: string;
    //TODO: there's more
    sorting: "avgsalesprice" | "-avgsalesprice";

    dayRange?: number;
    endDate?: EpochTimeStamp;
    startDate?: EpochTimeStamp;
    categoryId?: number;
    offset?: number;
    conditionId?: conditionIds;
    tz?: "Australia Sydney";
    marketplace?: "EBAY-AU";
    tabName?: "SOLD";
    minPrice?: number;
    maxPrice?: number;
}

export type RequiredProductSearchOptions = {
    keywords: string;
    //TODO: there's more
    sorting: "avgsalesprice" | "-avgsalesprice";
    dayRange: number;
    endDate: EpochTimeStamp;
    startDate: EpochTimeStamp;
    categoryId: number;
    offset: number;
    conditionId: conditionIds;
    tz: "Australia Sydney";
    marketplace: "EBAY-AU";
    tabName: "SOLD";
    modules: "aggregates" | "searchResults" | "resultsHeader"
    minPrice?: number
    maxPrice?: number
}
