import { categoryManager } from "@/app/server/setting/categoryManager";
import { NextRequest } from "next/server";
export function GET(request: NextRequest) {
    return Response.json(categoryManager.categories)
}
