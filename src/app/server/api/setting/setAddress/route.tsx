import { NextRequest } from "next/server";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import { setting } from "@/app/layout";
import logging from "@/app/utils/logger";

export async function PUT(request: NextRequest) {
    try {
        const payload = await request.json()
        // Update running axios config
        ebayApi.setAddress(payload["country"], payload["postcode"])

        // Save config to setting
        // setting.setting.shippingLocation = payload["country"]
        // setting.setting.shippingPostcode = payload["postcode"]
        // setting.save()
        return Response.json("", {
            status: 200
        })
    }
    catch(e) {
        logging.error(e)
        return Response.json("", {
            status: 400
        })
    }

}