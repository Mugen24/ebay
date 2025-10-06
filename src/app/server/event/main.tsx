import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Button } from "@/components/ui/button";
import { NewItemEvent } from "./NewItemEvent";
import { sendEmail } from "@/app/utils/sendEmail";
import { SSEStream } from "../api/setting/watch/stream/route";
class foo {
    update(items: ItemSummary[]) {
        console.log("Item received")
        // console.log(items)
    }
}

export function test() {
    // const newItemEvent = new NewItemEvent()

    // const sseStream = new SSEStream()
    // newItemEvent.addListener()
    // newItemEvent.startLoop()
}

// function EbayItem({item}: {item: ItemSummary}) {
//     const title = item.title
//     const price = `${item.price.value}${item.price.currency}`
//     const buyingOptions= item.buyingOptions
//     const style = {
//         "display": "flex",
//         "flex-direction": "column",
//     }
//     return (
//         <div style={style}>
//             <a href={item.itemWebUrl}>
//                 <h1>{title}</h1>
//             </a>
//             <img alt="item-image" src={item.image.imageUrl}>
//             </img>
//             <p>{buyingOptions}</p>
//             <p>{price}</p>
//         </div>
//     )
// }
// export async function updateEmail(items: ItemSummary[]) {
//     const { renderToString } = await import('react-dom/server')
//     const ebayItems = []
//     const ebayItemStyle = {
//         "display": "grid",
//         "grid-column-template": "repeat(1fr, 200px)"
//     }
//     for (const item of items) {
//         ebayItems.push(<EbayItem item={item}/>)
//     }

//     const gallery = (
//         <div style={ebayItemStyle}>
//             {ebayItems}
//         </div>
//     )
//     if (ebayItems.length) {
//         sendEmail("New ebay results", renderToString(gallery))
//     }
// }
