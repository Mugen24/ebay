"use client"
'use strict';

import { createContext, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Favourite, SettingType, Theme } from '../types/SettingType';
import { Countries, SEbaySearch } from "../EbayApi/EbaySaverState";
import { clientApiManager } from "../utils/clientApiManager";

export type SettingContextType = 
    |   {
            setting: MutableRefObject<SettingType | undefined>
            // setSetting: (setting: SettingType) => void
            isLoading: false,

            setTheme: (theme: Theme) => void,

            addFavourite: (favourite: Favourite) => void,
            removeFavourite: (id: EpochTimeStamp) => void,

            setExpireOffset: (number: number) => void,

            setShippingLocation: (country: keyof typeof Countries, postcode: number) => void

            setItemLocation: (item: keyof typeof Countries) => void
        }
    |  
        {
            setting?: MutableRefObject<SettingType | undefined>
            // setSetting: (setting: SettingType) => void
            isLoading: true,

            setTheme?: (theme: Theme) => void,

            addFavourite?: (favourite: Favourite) => void,
            removeFavourite?: (id: EpochTimeStamp) => void,

            setExpireOffset?: (number: number) => void,

            setShippingLocation?: (country: keyof typeof Countries, postcode: number) => void

            setItemLocation?: (item: keyof typeof Countries) => void
        } 
       

const SettingContext = createContext({})

export function SettingProvider({children}: {children: ReactNode}) {
    const setting = useRef<SettingType>()
    // const [theme, _setTheme] = useState<Theme>("light")
    // const [favourites, _setFavourites] = useState<Favourite[]>([])


    useEffect(() => {
        (async () => {
            setting.current = await clientApiManager.getSetting()
        })()
    }, [])

    function setSetting<K extends keyof SettingType>(newSetting: Record<K, SettingType[K]>){
        if (setting.current) {
            setting.current = {
                ...setting.current,
                ...newSetting
            }
        }
    }

    function setTheme(theme: Theme) {
        if (setting.current) {
            setting.current = {
                ...setting.current,
                theme: theme
            }
        } 
    }

    const addFavourite = useCallback((ebaySearch: SEbaySearch) => {
        const favourites = setting.current?.favouriteQueries ?? {}
        const id = Date.now()
        favourites[id] = {
                id: String(id),
                state: ebaySearch,
                readEbayItemNumbers: [],
        }
        setSetting({favouriteQueries: favourites})
    }, [])

    const removeFavourite = useCallback((id: EpochTimeStamp) => {
        const favourites = setting.current?.favouriteQueries ?? {}
        delete favourites[id]
        setSetting({
            favouriteQueries: favourites
        })
    }, [])

    const setExpireOffset = useCallback((offset: number) => {
        setSetting({
            defaultRefreshIntervalSecond: offset
        })
    }, [])

    const setShippingLocation = useCallback((country: keyof typeof Countries, postcode: number): void => {
        setSetting({
            shippingLocation: country,
            shippingPostcode: postcode
        })
    }, [])

    const setItemLocation = useCallback((location: keyof typeof Countries) => {
        setSetting({
            itemLocation: location
        })
    }, [])

    const value: SettingContextType = useMemo(() => {
        return {
            isLoading: false,
            setting,
            setTheme,
            addFavourite,
            removeFavourite,
            setExpireOffset,
            setShippingLocation,
            setItemLocation,
        }
    }, [setting, addFavourite,, removeFavourite, setExpireOffset, setItemLocation, setShippingLocation])

    if (!setting.current) {
        const newVal: SettingContextType = {
            ...value,
            "isLoading": true

        }
        return (
            <SettingContext.Provider value={value}>
                {children}
            </SettingContext.Provider>
        )
    }



    return (
        <SettingContext.Provider value={value}>
            {children}
        </SettingContext.Provider>
    )
}

export const useSetting = () => useContext(SettingContext) as SettingContextType
