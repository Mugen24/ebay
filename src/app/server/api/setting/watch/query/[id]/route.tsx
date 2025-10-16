import { NextRequest } from "next/server";
import { favourite } from "@/app/server/main";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }>}
)
    {
        const {id} = await params
        try {
            await favourite.removeQuery(id)
        } 
        catch (e) {
            console.error(e)
            return Response.json("", {
                "status": 401,
                "statusText": "Server error"
            })
        }

        return Response.json("", {
            "status": 200,
            "statusText": "OK"
        })
    }