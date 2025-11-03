'use client';
'use strict';

import { createContext, Dispatch, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { SettingType, Theme } from '../types/SettingType';
import { Countries, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { Categories } from "../server/setting/categoryManager";

export type StateContextType = {
        userData: UserData
        handleUserData: Dispatch<UserDataActionType>
    }

export type UserDataActionType = 
    | {type: 'updateSetting', results: {
        setting: SettingType
    }}
    | {type: 'updateTheme', results: {
        theme: Theme
    }}
    | {type: 'updateRefreshInterval', results: {
        refreshInterval: number
    }}
    | {type: 'updateShippingLocation', results: {
        "country": keyof typeof Countries,
        "postcode": number,
    }}
    | {type: 'updateItemLocation', results: {
        "country": keyof typeof Countries
    }}


export const StateContext= createContext({})
export type UserData = {
    setting: SettingType
    categories: Categories
    // favouriteQueries: FavouriteQueriesType
}

export function StateProvider({serverData, children}: {serverData: UserData, children: ReactNode}) {
    function userStateReducer(userData: UserData, actions: UserDataActionType) {
        const newState = {...userData}
        if (actions.type === "updateSetting") {
            newState.setting = actions.results.setting
        }
        else if (actions.type === "updateTheme") {
            newState.setting.theme = actions.results.theme
        }
        else if (actions.type === "updateItemLocation") {
            newState.setting.itemLocation = actions.results.country
        }
        else if (actions.type === "updateRefreshInterval") {
            newState.setting.defaultRefreshIntervalSecond = actions.results.refreshInterval
        }
        else if (actions.type === "updateShippingLocation") {
            newState.setting.shippingLocation = actions.results.country
            newState.setting.shippingPostcode = actions.results.postcode
        }

        return newState
    }

    const [userData, handleUserData] = useReducer(
        userStateReducer,
        serverData,
    )

    useEffect(() => {
        try {
            const userDataSession = localStorage.getItem("ebaySetting") ?? ""
            const userData = JSON.parse(userDataSession)
            handleUserData({
                type: "updateSetting",
                results: userData
            })
        } catch (error) {
            if (! (error instanceof SyntaxError)) {
                throw error
            }
        }
    }, [])

    useEffect(() => {
        // localStorage.setItem("ebaySetting", JSON.stringify(userData.setting))
    }, [userData])

    const value: StateContextType = useMemo(() => {
        //This guarantee that setting has been loaded
        return  {
            userData,
            handleUserData,
        }
    }, [userData])


    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateManager= () => useContext(StateContext) as StateContextType 
