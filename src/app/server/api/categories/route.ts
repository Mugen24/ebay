import { NextRequest } from "next/server"
import { categories } from "../../main"

export function GET(request: NextRequest) {
     return Response.json(categories.categories)
}

