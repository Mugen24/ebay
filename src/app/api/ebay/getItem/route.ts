import axios from "axios"
import { Ebay } from "../ebay"
import { NextRequest } from "next/server"

const fetch = axios.create({
    baseURL: process.env.BASE_URL
})
const ebay = await Ebay.initialise()
const _ = (async function () {
})()
    
export async function GET(request: NextRequest) {
    const query = new URL(request.url).searchParams
    const itemId = query.get("item_id")
    if (itemId === null) {
        return new Response("", {
            status: 400,
            statusText: "itemId is null"
        })
    }

    const resp = await ebay.getItem({ 
        item_id: itemId
    })

    console.log(resp)
    return Response.json(resp)
}
