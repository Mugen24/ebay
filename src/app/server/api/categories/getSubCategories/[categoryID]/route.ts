import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import { categories } from "@/app/server/main";
import { NextRequest } from "next/server";
export async function GET(
    request: NextRequest,
    {params}: {params: Promise<{categoryID: string}>}
) {
    const {categoryID} = await params
    const [outcome, data] = await ebayApi.getSubCategoryTree({
        "category_tree_id": categories.categories.categoryTreeId,
        "category_id": categoryID
    })
    if (!outcome) {
        return Response.error()
    }

    return Response.json(data, {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    })
}
