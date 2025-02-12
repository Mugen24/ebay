import { Setting } from "@/app/api/setting/settings"

export async function POST(request: Request) {
    const [outcome, desc] = Setting.loadFromFile()
    if (outcome) {
        return Response.json(desc, {
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
    const [outcome, desc] = Setting.saveToFile(body)
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

