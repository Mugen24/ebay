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
        id integer primary key, --epid
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
import { NewItemEvent } from "./event/NewItemEvent";
import { ItemWachEvent } from "./event/ItemWatchEvent";

import { EmailNotification, EmailUpdateType } from "./event/listeners/EmailNotification";

export type ServerEvents = {
    "newItemEvent": NewItemEvent
    "itemWatchEvent": ItemWachEvent
}

const serverEvents: ServerEvents = {
    "newItemEvent": new NewItemEvent(db),
    "itemWatchEvent": new ItemWachEvent(favourite)
}

//Listeners
const queryMail = new EmailNotification("New Item", EmailUpdateType.newItemEvent)
serverEvents.newItemEvent.addListener(queryMail)

const itemMail = new EmailNotification("Item Update", EmailUpdateType.ItemWachEvent)
serverEvents.newItemEvent.addListener(itemMail)

serverEvents.itemWatchEvent.addListener(itemMail)


Object.values(serverEvents).forEach(event => event.startLoop())


export {
    setting,
    categories,
    favourite,
    db,
    serverEvents
}
