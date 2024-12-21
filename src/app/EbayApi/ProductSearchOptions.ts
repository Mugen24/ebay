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


// https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726972156419&startDate=1632364156419&categoryId=0&offset=0&limit=50&sorting=avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
// https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726974855720&startDate=1632366855720&categoryId=0&conditionId=3000&minPrice=100&offset=0&limit=50&sorting=-avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
//async searchLowestSoldBetter(searchTerm: string, minPrice: number = 0) {
//
//}
