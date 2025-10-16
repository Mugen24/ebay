import { favourite } from "@/app/server/main"

export async function GET() {
    const favItems = await favourite.getItems()
    return Response.json({
        "items": favItems
    }, {
        status: 200,
        headers: {
            "content-type": "application/json"
        }
    })
}