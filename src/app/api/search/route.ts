import { URLSearchParamsToJson } from "@/app/actions/utils";
import { search } from "@/app/EbayApi/EbayApi";

export async function POST(request: Request) {
    const url = new URL(request.url)
    const params = URLSearchParamsToJson(
        url.searchParams
    )
    const body = await request.json()
    const resp = await search(params, body)
    return Response.json(resp, {
        status: 200
    });
}