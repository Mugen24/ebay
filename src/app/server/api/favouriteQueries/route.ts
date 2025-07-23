import { favouriteQueries } from '../../../serverInit';
export async function POST(request: Request) {
    const body = await request.json()
    favouriteQueries.add(body)    
    return new Response()
}
export async function DELETE(request: Request) {
    const body = await request.json()
    favouriteQueries.remove(body)
    return new Response()
}