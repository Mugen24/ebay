import { NextRequest, NextResponse } from "next/server";
import { serverEvents } from "@/app/server/main";
import { NewItemStream } from "@/app/server/event/listeners/NewItemStream";


export async function GET(request: NextRequest) {
    const newItemStream = new NewItemStream()
    serverEvents.newItemEvent.addListener(newItemStream)
    return new Response(newItemStream.apiBody, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }

    })
}
