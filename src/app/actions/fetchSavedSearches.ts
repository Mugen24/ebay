"use server"
import { writeFile } from "fs/promises";
import path from "path";
import config from "../data/searchConfig.json"
import { checkNewListing } from "./utils";
import { search } from "./EbayApiWrapper";

const PATH = path.resolve("src/app/data/searchConfig.json");

export async function fetchSavedSearches() {
    const responses = []

    for (const searchParam of Object.values(config["searchParams"])) {

        const res = await search(searchParam)
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