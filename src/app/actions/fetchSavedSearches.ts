"use server"
import { writeFile } from "fs/promises";
import path from "path";
import config from "../data/searchConfig.json"
import { checkNewListing } from "./utils";
import { EbayApiWrapper } from "./EbayApiWrapper";

const PATH = path.resolve("src/app/data/searchConfig.json");

export async function fetchSavedSearches() {
    console.log(config)
    const responses = []

    for (const searchParam of Object.values(config["searchParams"])) {

        const res = await EbayApiWrapper.search(config)
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