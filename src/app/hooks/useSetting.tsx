"use client"
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Favourite, SettingType, Theme } from '../types/SettingType';
import axios from "axios";
import logging from "../utils/logger";
import { ShippingOption } from '../types/EbayApiTypes/ebaySeachTypes';
import { Countries, SEbaySearch } from "../EbayApi/EbaySaverState";
import { clientApiManager } from "../utils/clientApiManager";

export type SettingContextType = {
    setting: SettingType
    // setSetting: (setting: SettingType) => void

    setTheme: (theme: Theme) => void,

    addFavourite: (favourite: Favourite) => void,
    removeFavourite: (id: EpochTimeStamp) => void,

    setExpireOffset: (number: number) => void,

    setShippingLocation: (country: keyof typeof Countries, postcode: number) => void

    setItemLocation: (item: keyof typeof Countries) => void
}

const SettingContext = createContext({})

export function SettingProvider({children}: {children: ReactNode}) {
    const [setting, _setSetting] = useState<SettingType>()
    // const [theme, _setTheme] = useState<Theme>("light")
    // const [favourites, _setFavourites] = useState<Favourite[]>([])


    useEffect(() => {
        (async () => {
            const setting = await clientApiManager.getSetting()
            _setSetting(setting)
        })()
    }, [])

    function setSetting<K extends keyof SettingType>(newSetting: Record<K, SettingType[K]>){
        if (setting) {
            _setSetting({
                ...setting,
                ...newSetting
            })
        }
    }

    function setTheme(theme: Theme) {
        if (setting) {
            _setSetting({
                ...setting,
                theme: theme
            })
        } 
    }

    function addFavourite(ebaySearch: SEbaySearch) {
        const favourites = setting?.favouriteQueries ?? {}
        const id = Date.now()
        favourites[id] = {
                id: String(id),
                state: ebaySearch,
                readEbayItemNumbers: [],
        }

        setSetting({favouriteQueries: favourites})
    }

    function removeFavourite(id: EpochTimeStamp) {
        const favourites = setting?.favouriteQueries ?? {}
        delete favourites[id]
        setSetting({
            favouriteQueries: favourites
        })
    }

    function setExpireOffset(offset: number) {
        setSetting({
            defaultRefreshIntervalSecond: offset
        })
    }

    function setShippingLocation(country: keyof typeof Countries, postcode: number): void {
        setSetting({
            shippingLocation: country,
            shippingPostcode: postcode
        })
    }

    function setItemLocation(location: keyof typeof Countries) {
        setSetting({
            itemLocation: location
        })
    }

    if (!setting) {
        return (
            <h1>Loading</h1>
        )
    }


    const value: SettingContextType = {
        setting,
        setTheme,
        addFavourite,
        removeFavourite,
        setExpireOffset,
        setShippingLocation,
        setItemLocation,
    }

    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSetting = () => useContext(SettingContext) as SettingContextType
