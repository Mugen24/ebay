import { NextRequest, NextResponse } from "next/server";
import { setInterval } from "node:timers";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";

export async function GET(request: NextRequest) {
    const DELAY = 1000
    const stream = new TransformStream()
    const encoder = new TextEncoder()
    const writer = stream.writable.getWriter()

    const intervalID = setInterval(() => {
        writer.write(encoder.encode(`data: {test: 10}`))
        writer.write(encoder.encode(`\n\n`))
    }, DELAY)

    return new Response(stream.readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-store, no-cache",
            "Connection": "keep-alive",
        }

    })
}