import ClientSideApp from "./ClientSideApp";

// import { CategoryProvider } from "./hooks/useCategories";
import logging from "./utils/logger";
// import { setting, categories } from "./layout";


import { Setting } from "./server/setting/settings";
import { CategoryManager  } from "./server/setting/categoryManager";
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { FavouriteQueries } from "./server/setting/favouriteQueries";

logging.debug("Server started")

const SCHEMA =  `
    create table if not exists setting (
        theme text,
        watchedItems text,
        shippingLocation text,
        shippingPostcode integer,
        itemLocation text,
        marketPlaceId text,
        defaultRefreshIntervalSecond integer
    );

    create table if not exists categories (
        version text,
        categories text
    );

    create table if not exists favouriteQueries (
        id integer primary key autoincrement,
        ebaySearch text 
    );
`

const db = await open({
    filename: process.env.DATABASE!,
    driver: sqlite3.Database
})

await db.exec(SCHEMA)

export const setting = await Setting.init(db)
export const categories = await CategoryManager.init(setting, db)
export const favouriteQueries= await FavouriteQueries.init(db)


export default async function App() {
    const serverData = {
        setting: setting.setting,
        categories: categories.categories
    }

    return (
        <ClientSideApp 
            serverData={serverData}>
        </ClientSideApp>
    )
}



