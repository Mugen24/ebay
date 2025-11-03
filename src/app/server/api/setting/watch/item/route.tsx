import { favourite } from "@/app/server/main"
import { EbayGetItemReturn } from "@/app/types/EbayApiTypes/ebayGetItemTypes"
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes"

type ItemID = string
export type FavouriteItemType = {
    id: ItemID, 
    ebayItem: ItemSummary
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
