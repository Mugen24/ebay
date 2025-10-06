import { NewItemEvent, NewItemFormat, NewItemSubscriber } from "@/app/server/event/NewItemEvent";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { NextRequest, NextResponse } from "next/server";
import { setInterval } from "node:timers";

export class SSEStream implements NewItemSubscriber {
    stream: TransformStream<any, any>;
    encoder: TextEncoder;
    writer: WritableStreamDefaultWriter<any>;
    constructor() {
        this.stream = new TransformStream()
        this.encoder = new TextEncoder()
        this.writer = this.stream.writable.getWriter()
    }

    update(data: NewItemFormat): void {
        console.log("new item")
        this.writer.write(this.encoder.encode(`data: ${JSON.stringify(data)}`))
        this.writer.write(this.encoder.encode(`\n\n`))
    }
}

const sseStream = new SSEStream()
const newItemEvent = new NewItemEvent()
newItemEvent.addListener(sseStream)
newItemEvent.startLoop()

export async function GET(request: NextRequest) {
    // const DELAY = 1000
    // const stream = new TransformStream()
    // const encoder = new TextEncoder()
    // const writer = stream.writable.getWriter()

    // const intervalID = setInterval(() => {
    //     // writer.write(encoder.encode(`data: {"test": 10}`))
    //     writer.write(encoder.encode(`\n\n`))
    // }, DELAY)



    return new Response(sseStream.stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }

    })
}
