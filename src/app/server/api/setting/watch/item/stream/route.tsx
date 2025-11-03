import { StreamListener } from "@/app/server/event/listeners/NewItemStream";
import { serverEvents } from "@/app/server/serverEvents";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest
) 
{
    const itemWatch = new StreamListener()
    serverEvents.itemWatchEvent.addListener("SSEStream:", itemWatch.update)

    const response = Response.json(itemWatch.apiBody, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }
    })
    return response
}
