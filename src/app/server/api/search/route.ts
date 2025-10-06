import { URLSearchParamsToJson } from "@/app/actions/utils";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import logging from "@/app/utils/logger";

export const dynamic = 'force-static'

export async function POST(request: Request) {
    //Post request requires additional data beyond just EbaySearch
    //addition data are relayed as URL query
    logging.group("Server: fetch ebay api search")
    logging.debug("URL: ", request.url)

    const searchParam = new URLSearchParams(request.url)
    const body = await request.json()

    logging.debug("payload: ", body)
    let response;


    let additonalConfig = {}
    if (searchParam.get("extraParam")) {
        additonalConfig = JSON.parse(searchParam.get("extraParam"))
    }
    const [outcome, data] = await ebayApi.search(body, additonalConfig)

    if (outcome) {
        response = Response.json(data, {
            status: 200
        });
    } else {
        response = Response.json({}, {
            status: 404
        })
    }

    logging.groupEnd()
    return response
}
