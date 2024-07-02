"use server"
import { Ebay } from "./api/ebay/ebay"
import config from "./data/searchConfig.json"

export async function PollingQueries() {
    const responses = []
    for (const searchParam of config["searchParams"]) {
        const ebay = await Ebay.initialise();
        const res = await ebay.search(searchParam)
        res.itemSummaries= res.itemSummaries.filter((value) => {
            return Ebay.checkNewListing(value);
        }) 
        responses.push(res);
    }
    return responses;
}

