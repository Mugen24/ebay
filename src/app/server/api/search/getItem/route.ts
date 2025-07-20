import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const query = await request.json()
    const [outcome, data] = await ebayApi.getItem(query)
    if (outcome) {
        return Response.json(data)
    }
    else {
        return Response.json({}, {
            status: 404
        })
    }
}
