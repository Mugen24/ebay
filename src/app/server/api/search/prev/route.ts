import { URLSearchParamsToJson } from "@/app/actions/utils";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import logging from "@/app/utils/logger";

export const dynamic = 'force-static'

export async function POST(request: Request) {
    const searchParam = new URLSearchParams(request.url)
    const body = await request.json()
    let response;
    const [outcome, data] = await ebayApi.searchPrevious(body)
    if (outcome) {
        response = Response.json(data, {
            status: 200
        });
    } else {
        response = Response.json(data, {
            status: 404
        })
    }

    return response
}
