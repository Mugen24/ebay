"use server"
import { writeFile } from "fs/promises";
import { Ebay, EbaySearchConfig } from "./api/ebay/ebay"
import config from "./data/searchConfig.json"
import { checkNewListing } from "./utils";
import path from "path";

const PATH = path.resolve("src/app/data/searchConfig.json");

export async function PollingQueries() {
    console.log(config)
    const responses = []
    for (const searchParam of config["searchParams"]) {
        const ebay = await Ebay.authenticate();

        const config = new EbaySearchConfig()
        config.setParams(searchParam)

        const res = await ebay.search(config)
        res.itemSummaries= res.itemSummaries.filter((value) => {
            return checkNewListing(value);
        }) 
        responses.push(res);
    }

    config.lastRunTime = new Date(Date.now()).toISOString()
    try {
        writeFile(PATH, JSON.stringify(config))
    }
    catch (e) {
        console.log(e)
    }

    return responses;
}
