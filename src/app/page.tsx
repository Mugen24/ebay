'use server'
import ClientSideApp from "./ClientSideApp";

// import { CategoryProvider } from "./hooks/useCategories";
import { ServerContext } from "./Init";
import logging from "./utils/logger";
import { Setting } from "./server/setting/settings";
import { Categories, CategoryManager  } from "./server/setting/categoryManager";
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { createContext } from "react";
import { SettingType } from "./types/SettingType";

logging.debug("Server started")

const SCHEMA =  `
    create table if not exists setting (
        theme text,
        favouriteQueries text,
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
`
export default async function App() {
    const db = await open({
        filename: process.env.DATABASE!,
        driver: sqlite3.Database
    })

    await db.exec(SCHEMA)



    const setting = await Setting.init(db)
    const categories = await CategoryManager.init(setting, db)
    // const categories= await CategoryManager.init(db)
    const serverData = {
        setting: setting.setting,
        categories: categories.categories
    }

    return (
        <ClientSideApp serverData={serverData}> </ClientSideApp>
    )
}



