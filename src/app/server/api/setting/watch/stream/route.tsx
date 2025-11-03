import { NextRequest, NextResponse } from "next/server";
import { StreamListener } from "@/app/server/event/listeners/NewItemStream";
import { serverEvents } from "@/app/server/main";
import logging from "@/app/utils/logger";


const newItemStream = new StreamListener()
serverEvents.newItemEvent.addListener("SSEStream", newItemStream.update)
const readableStream: ReadableStream = newItemStream.apiBody
// const transformStream = new TransformStream()
// const readable = readableStream.pipeThrough(transformStream)

export async function GET(request: NextRequest) {


    const resp = new Response(readableStream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }

    })


    return resp
}
