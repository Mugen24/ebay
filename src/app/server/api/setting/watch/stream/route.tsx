import { newItemStream } from "@/app/server/event/main";
import { NewItemEvent, NewItemFormat, NewItemSubscriber } from "@/app/server/event/NewItemEvent";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { NextRequest, NextResponse } from "next/server";
import { setInterval } from "node:timers";

export async function GET(request: NextRequest) {
    // const DELAY = 1000
    // const stream = new TransformStream()
    // const encoder = new TextEncoder()
    // const writer = stream.writable.getWriter()

    // const intervalID = setInterval(() => {
    //     // writer.write(encoder.encode(`data: {"test": 10}`))
    //     writer.write(encoder.encode(`\n\n`))
    // }, DELAY)



    return new Response(newItemStream.apiBody, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }

    })
}
