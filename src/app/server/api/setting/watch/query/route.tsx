import { favourite } from "@/app/layout";
import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { NextRequest } from "next/server";

export async function POST(
    request : NextRequest,
) {
    const body = await request.json()    
    const query: EbaySearch = body["query"]
    const {id} = await favourite.addQuery(query)
    return Response.json(({
        "ID": id
    }), {
        "status": 200,
        "statusText": "created"
    })
}


export async function GET(
) {
    const queries = await favourite.getQueries()
    return Response.json({
        data: queries
    }, {
        "status": 201,
        "statusText": "created",
        "headers": {
            "Content-Type": "application/json"
        }
    })
}