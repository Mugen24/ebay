import { ebayApi } from "@/app/server/EbayApi/EbayApi";
export const dynamic = 'force-static'

export async function POST(request: Request) {
    const searchParam = new URLSearchParams(request.url)
    const body = await request.json()

    let additonalConfig = {}
    // if (searchParam.get("extraParam")) {
    //     additonalConfig = JSON.parse(searchParam.get("extraParam"))
    // }

    const [outcome, data] = await ebayApi.searchNext(body, additonalConfig)

    let response = undefined
    if (outcome) {
        response = Response.json(data, {
            status: 200
        });
    } else {
        response = Response.json(data, {
            status: 404
        })
    }

    return response
}
