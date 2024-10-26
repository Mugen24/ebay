import { URLSearchParamsToJson } from "@/app/actions/utils";
import { search } from "@/app/EbayApi/EbayApi";

export async function GET(request: Request) {
    const url = new URL(request.url)
    const params = URLSearchParamsToJson(
        url.searchParams
    )
    const resp = await search(params)
    return Response.json(resp, {
        status: 200
    });
}