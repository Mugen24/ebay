
// export async function GET(request: Request) {
//     return Response.json(setting.setting, {
//         status: 200,
//         statusText: "ok"
//     })
// }

export async function PUT(request: Request) {
    const params = await request.json()
    try {
        // await setting.save(params)
        return Response.json({},{
            status: 200,
            statusText: "ok"
        }) 
    }
    catch {
        return Response.json({}, {
            status: 404,
            statusText: "Server error"
        })
    }

}


