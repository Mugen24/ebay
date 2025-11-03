import { NewItemFormat, NewItemEvent } from '../NewItemEvent';
import { MessageHeaders, SMTPClient } from "emailjs"
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { ReactNode } from "react";
import { TimerComponent } from "@/app/components/baseComponents/Timer";
import { sendEmail } from "@/app/utils/sendEmail";
import logging from '@/app/utils/logger';


export function CssEbayItem({item}: {item: ItemSummary}) {
    const price = item.price?.value
    const currency= item.price?.currency

    return (
        <td
            style={{
                border: "1px solid black",
                padding: 0,
                margin: 0,
                gap: 0,
                height: "200px",
                overflow: "hidden"
            }}
        >
            <section 
                className="card-header"
                style={{
                    fontSize: "0.4rem"
                }}
            >
                <a 
                    href={item.itemWebUrl}
                    style={{
                        textAlign: "center",
                        textDecoration: "underline",
                        width: "fit-content"
                    }}
                >
                    <h1
                        style={{
                            fontSize: "0.5rem"
                        }}
                    >
                        {item.title}
                    </h1>
                </a>
                <p>condition: {item.condition}</p>
                <p>date: {new Date(item.itemCreationDate).toUTCString()}</p>
                {
                    item.buyingOptions.includes("AUCTION")
                    ?  <TimerComponent 
                            startDate={new Date(item.itemCreationDate)}
                            endDate={new Date(item.itemEndDate)}
                       />
                    : <></>
                }

                <p>type: {item.buyingOptions}</p>
                <p>eid: {item.itemId.split("|")[1]}</p>
            </section>
            <section 
                className="card-content"
                style={{
                }}
            >
                <picture>
                    <img
                        src={item.image?.imageUrl ?? null} 
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain"
                        }}
                        alt={item.title}
                    />

                </picture>
            </section>
            <section 
                className="card-footer"
                style={{
                }}
            >
                <h1
                    style={{
                        textAlign: "end",
                        fontSize: "0.6rem"
                    }}
                >
                    {price} {currency}
                </h1>
            </section>
        </td>
    ) 
}


export async function sendNewItemsToEmail(data: NewItemFormat): Promise<boolean> {
    const COLUMN_SIZE = 4
    let {id, items, query} = data
    const title = query["q"]

    const styledItems: ReactNode[] = []

    let tempGroup: ReactNode[] = []
    for (const item of items) {
        tempGroup.push(<CssEbayItem key={item.itemId} item={item}/>)

        if (tempGroup.length === COLUMN_SIZE) {
            styledItems.push((
                <tr
                    key={Date.now()}
                    style={{
                        //tr default is "baseline" 
                        //all child while try to align with each other
                        verticalAlign: "top" 
                    }}
                >
                    {Array.from(tempGroup)} 
                </tr>
            ))

            tempGroup = []
        }
    }

    const messageBody = (
        <html>
            <header>
            </header>
            <body
                style={{
                    
                }}
            >
                <h1>{title}</h1>
                <div
                >
                    <table
                        style={{
                            width:"90vw",
                            tableLayout: "fixed",
                            overflow: "scroll"

                        }}
                    >
                        {styledItems} 
                    </table>
                </div>
            </body>
        </html>
    )
    
    const ReactDOMServer = (await import('react-dom/server')).default
    // return ReactDOMServer.renderToStaticMarkup(messageBody)
    return sendEmail(`Ebay: ${query['q']}`, ReactDOMServer.renderToStaticMarkup(messageBody))
}





/*
    static async ItemWachEvent(data: ItemWatchListenerType) {
        const ReactDOMServer = (await import('react-dom/server')).default
        const ebayItem = CssEbayItem({
            "item": data.ebayGetItemReturn as unknown as ItemSummary
        })

        return ReactDOMServer.renderToStaticMarkup(ebayItem)
    }
*/
