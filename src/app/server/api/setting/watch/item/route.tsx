import { favourite } from "@/app/server/main"
import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes"

type ItemID = string
export type FavouriteItemType = {
    id: ItemID, 
    data: string
}
export async function GET() {
    const favItems: FavouriteItemType[] = await favourite.getItems()
    return Response.json({
        "items": favItems
    }, {
        status: 200,
        headers: {
            "content-type": "application/json"
        }
    })
}