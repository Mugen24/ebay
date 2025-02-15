import { setting } from "@/app/server/Init"
import { Setting } from "@/app/server/setting/settings"

export async function POST(request: Request) {
    if (setting){
        return Response.json(setting.setting, {
            status: 200,
            statusText: "ok"
        })
    } else {
        return Response.json({}, {
            status: 404,
            statusText: "Server error"
        })
    }
}

export async function PUT(request: Request) {
    const body = await request.json()
    const [outcome, desc] = setting.saveToFile(body)
    if (outcome) return Response.json({},{
        status: 200,
        statusText: "ok"
    }) 
    else {
        return Response.json({}, {
            status: 404,
            statusText: "Server error"
        })
    }

}

export async function Delete(request: Request) {

}

