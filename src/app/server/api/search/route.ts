import { URLSearchParamsToJson } from "@/app/actions/utils";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import logging from "@/app/utils/logger";

export const dynamic = 'force-static'
export async function POST(request: Request) {
    logging.group("Server: fetch ebay api search")
    logging.debug("URL: ", request.url)
    // const url = new URL(request.url)
    // const { query } = URLSearchParamsToJson(url.searchParams)
    const body = await request.json()
    logging.debug("payload: ", body)


    let response;
    const [outcome, data] = await ebayApi.search(body)

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
