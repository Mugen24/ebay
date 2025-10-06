import { NextRequest } from "next/server";
import { favourite } from "@/app/layout";

export async function GET(
    request : NextRequest,
    { params }: { params: Promise<{ id: string }>}
) {
    const {id} = await params
    const itemData = await favourite.getItem(id)
    if (itemData) {
        return Response.json("", {
            status: 200
        })
    } else {
        return Response.json("", {
            status: 405
        })
    }
}

export async function PUT(
    request : NextRequest,
    { params }: { params: Promise<{ id: string }>}
) {
    const {id} = await params
    const data = await request.json()
    const dbID= await favourite.addItem(id, JSON.stringify(data))
    return Response.json(dbID, {
        status: 200
    })
}

export async function DELETE(
    request : NextRequest,
    { params }: { params: Promise<{ id: string }>}
) {
    const {id} = await params
    await favourite.removeItem(id)
    return Response.json("", {
        status: 200
    })
}