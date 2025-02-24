"use client"
import { ReactElement } from "react";
import { EbayItemId, EpochTimeStamp } from "../types/SettingType";
import { FavouriteQueryElement } from "../components/baseComponents/FavouriteQueryElement";
import { WatchItemElement } from "../components/baseComponents/WatchItemElement";
import { useSetting } from "../hooks/useSetting";
import { clientApiManager } from "../utils/clientApiManager";
import logging from "../utils/logger";


export function SavedQueryGallery() 
    {
        const {setting} = useSetting()

        if (!setting?.current) return (
            <h1>Loading Gallery...</h1>
        )

        const favouriteQueries = setting?.current.favouriteQueries
        const favouriteQueriesElement: Record<EpochTimeStamp, ReactElement<typeof FavouriteQueryElement>> = {}

        Object.keys(favouriteQueries).forEach(async (id) => {
            const [outcome, searchResponse] = await clientApiManager.search(favouriteQueries[id].state)
            if (outcome) {
                favouriteQueriesElement[id] = <FavouriteQueryElement favourite={favouriteQueries[id]} ebaySearchReturn={searchResponse}/>
            } else {
                logging.warn("Unable to search for queries", favouriteQueries[id])
            }
        })

        const watchItems = setting.current.watchedItems
        const watchItemsElements: Record<EbayItemId, ReactElement<typeof WatchItemElement>> = {}
        Object.keys(watchItems).forEach(async (id) => {
            const [outcome, itemRes] = await clientApiManager.getItem(watchItems[id].itemData)
            if (outcome) {
                watchItemsElements[id] = <WatchItemElement watchItem={watchItems[id]} ebayGetItemReturn={itemRes}/>
            } else {
                logging.warn("Unable to fetch watchItems")
            }
        })


        return (
            <>
                <div>
                    {Object.values(favouriteQueriesElement)}
                </div>
                <div>
                    {Object.values(watchItemsElements)}
                </div>
            </>
        )

    }



