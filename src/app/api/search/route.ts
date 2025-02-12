import { URLSearchParamsToJson } from "@/app/actions/utils";
import { search } from "@/app/EbayApi/EbayApi";
import logging from "@/app/utils/logger";

export async function POST(request: Request) {
    const url = new URL(request.url)
    const params = URLSearchParamsToJson(
        url.searchParams
    )
    const body = await request.json()
    try {
        const resp = await search(params, body)
        return Response.json(resp, {
            status: 200
        });
    } catch (error){
        logging.error(error)
        return  Response.json({}, {
            status: 404
        })
    }
}