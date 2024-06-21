import axios from "axios"
import { Ebay } from "../ebay"
import { NextRequest } from "next/server"
import { URLSearchParams } from "url"

const fetch = axios.create({
    baseURL: process.env.BASE_URL
})
const ebay = await Ebay.initialise()
const _ = (async function () {
})()

function searchParamsToJson(searchParam: URLSearchParams) {
    const searchJson: Record<string, string> = {}
    for (const [key, value] of searchParam) {
        searchJson[key] = value
    }
    return searchJson
}

function isEbaySearch(json_obj: Record<string, any>) {
    if (!('q' in json_obj)) {
        return false
    }
    return true
}

export async function GET(request: NextRequest) {
    let is_error = false
    let error_reason = ""

    const searchOptions= searchParamsToJson(new URL(request.url).searchParams)
    if (!isEbaySearch(searchOptions)) {
        is_error = true
        error_reason = "Not EbaySearch"
    }


    if (is_error) {
        console.trace(error_reason)
        return new Response("", {
            status: 400,
            statusText: error_reason
        })
    }

    const resp = await ebay.search(
        searchOptions
    )

    return Response.json(resp)
}
