import { URLSearchParamsToJson } from "@/app/actions/utils";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import logging from "@/app/utils/logger";

export async function POST(request: Request) {
    logging.group("Server: fetch ebay api search")
    const url = new URL(request.url)
    const params = URLSearchParamsToJson(
        url.searchParams
    )
    const body = await request.json()
    let response;
    const [outcome, data] = await ebayApi.search(params, body)
    logging.debug("Result: ", outcome)
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
