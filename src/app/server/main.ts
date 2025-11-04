import logging from "../utils/logger"
import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

import { CategoryManager  } from "./setting/categoryManager";
import { Favourite } from "./setting/favourite";
import { Setting } from "./setting/settings";

logging.debug("Server started")
const SCHEMA =  `
    create table if not exists setting (
        version text primary key, 
        theme text,
        watchedItems text,
        shippingLocation text,
        shippingPostcode integer,
        itemLocation text,
        marketPlaceId text,
        defaultRefreshIntervalSecond integer
    );

    create table if not exists categories (
        version text primary key,
        categories text
    );

    create table if not exists favouriteQueries (
        id integer primary key autoincrement,
        ebaySearch text,
        lastCheckedEpoch integer
    );

    create table if not exists favouriteItems (
        id text primary key, --epid
        data text
    );
`

const db = await open({
    filename: process.env.DATABASE!,
    // filename: ":memory:",
    driver: sqlite3.Database
})
await db.exec(SCHEMA)


const setting = await Setting.init(db)
const categories = await CategoryManager.init(setting, db)
const favourite= await Favourite.init(db)


//Events
import { ItemWatchEvent } from "./event/ItemWatchEvent";
import { NewItemEvent } from "./event/NewItemEvent";
import { sendNewItemsToEmail } from "./event/listeners/EmailNotification";
import { StreamListener } from "./event/listeners/NewItemStream";

export type ServerEvents = {
    "newItemEvent": NewItemEvent
    "itemWatchEvent": ItemWatchEvent
}

const serverEvents: ServerEvents = {
    "newItemEvent": new NewItemEvent(db),
    "itemWatchEvent": new ItemWatchEvent(favourite)
}

// Listeners
serverEvents.newItemEvent.addListener("Email", sendNewItemsToEmail)

// const newItemStream = new StreamListener()
// serverEvents.newItemEvent.addListener("SSEStream", newItemStream.update)

// serverEvents.itemWatchEvent.addListener("Email", async (payload) => {
//     const {id, ebayGetItemReturn} = payload
//     const ebayItemRender = CssEbayItem({
//         item: ebayGetItemReturn as unknown as ItemSummary
//     })
//     return sendEmail("NewItem", await reactComponentToString(ebayItemRender))
// })


Object.values(serverEvents).forEach(event => event.startLoop())


export {
    setting,
    categories,
    favourite,
    db,
    serverEvents
}
