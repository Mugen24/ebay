import { categoriesManager } from "@/app/server/Init";
import { NextRequest } from "next/server";
export function GET(request: NextRequest) {
    return Response.json(categoriesManager.categories)
}