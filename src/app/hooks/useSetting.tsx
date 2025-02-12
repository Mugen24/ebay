import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Favourite, SettingType, Theme } from '../types/SettingType';
import axios from "axios";
import logging from "../utils/logger";
import { ShippingOption } from '../types/EbayApiTypes/ebaySeachTypes';
import { Countries, SEbaySearch } from "../EbayApi/EbaySaverState";
import { ClientApiManager } from "../utils/clientApiManager";

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
    const [setting, _setSetting] = useState<SettingType>({})
    const clientApiManagerRef = useRef(new ClientApiManager())
    // const [theme, _setTheme] = useState<Theme>("light")
    // const [favourites, _setFavourites] = useState<Favourite[]>([])


    useEffect(() => {
        (async () => {
            const setting = await clientApiManagerRef.current.getSetting()
            _setSetting(setting)
        })()
    }, [])

    function setSetting(){
        clientApiManagerRef.current.setSetting(setting)
    }

    function setTheme(theme: Theme) {
        _setSetting({
            ...setting,
            theme: theme
        })
    }

    function addFavourite(ebaySearch: SEbaySearch) {
        const favourites = setting.favourites ?? {}
        favourites[Date.now()] = {
                state: ebaySearch,
                readEbayItemNumbers: [],
            }

        _setSetting({
            ...setting,
            favourites: favourites
        })
    }

    function removeFavourite(id: EpochTimeStamp) {
        const favourites = setting.favourites ?? {}
        delete favourites[id]
    }

    function setExpireOffset(offset: number) {
        _setSetting({
            ...setting,
            expiresOffset: offset
        })
    }

    function setShippingLocation(country: keyof typeof Countries, postcode: number): void {
        _setSetting({
            ...setting,
            shippingLocation: country,
            shippingPostcode: postcode
        })
    }

    function setItemLocation(location: keyof typeof Countries) {
        _setSetting({
            ...setting,
            itemLocation: location
        })
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