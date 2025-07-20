'use client';
'use strict';

import { createContext, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Favourite, SettingType, Theme } from '../types/SettingType';
import { Countries, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { clientApiManager } from "../utils/clientApiManager";
import { Categories } from '../server/setting/categoryManager';

export type StateContextType = {
        setting: SettingType,
        categories: Categories
        setTheme: (theme: Theme) => void,
        addFavourite: (ebaySearch: SEbaySearch) => void,
        removeFavourite: (id: number) => void,
        setRefreshInterval: (offset: number) => void,
        setShippingLocation: (country: keyof typeof Countries, postcode: number) => void,
        setItemLocation: (country: keyof typeof Countries) => void,
    }
       

export const StateContext= createContext({})

export function StateProvider({serverData, children}: {serverData: Record<string, any>, children: ReactNode}) {
    const [setting, _setSetting] = useState<SettingType>(serverData!.setting)
    // const categories= useState<Categories>(serverData.categoryManager)
    function setSetting(value: Record<string, any>) {
        _setSetting({
            ...setting,
            ...value
        })
    }

    const setTheme = useCallback(
        (theme: Theme) => {
            setSetting({
                theme: theme
            })
        }, [setting.theme])

    const addFavourite = useCallback((ebaySearch: SEbaySearch) => {
        const favourites = setting.favouriteQueries 
        const id = Date.now()
        favourites[id] = {
                id: String(id),
                state: ebaySearch,
                readEbayItemNumbers: [],
        }
        setSetting({favouriteQueries: favourites})
    }, [])

    const removeFavourite = useCallback((id: EpochTimeStamp) => {
        const favourites = setting.favouriteQueries 
        delete favourites[id]
        setSetting({
            favouriteQueries: favourites
        })
    }, [])

    const setRefreshInterval= useCallback((offset: number) => {
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

    const setItemLocation = useCallback((country: keyof typeof Countries) => {
        setSetting({
            itemLocation: location
        })
    }, [])

    const value: StateContextType = useMemo(() => {
        //This guarantee that setting has been loaded
        return  {
            setting,
            setTheme,
            addFavourite,
            removeFavourite,
            setRefreshInterval,
            setShippingLocation,
            setItemLocation,
        }
    }, [setting, setTheme, addFavourite, removeFavourite, setItemLocation, setShippingLocation, setRefreshInterval])


    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateManager= () => useContext(StateContext) as StateContextType 
