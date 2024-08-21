import { search } from "@/app/actions/EbayApiWrapper";
import { URLSearchParamsToJson } from "@/app/actions/utils";

export async function GET(request: Request) {
    return Response.json(URLSearchParamsToJson(new URLSearchParams(request.url)), {status: 200})
}