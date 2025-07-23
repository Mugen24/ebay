'use client';
'use strict';

import { createContext, Dispatch, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Favourite, SettingType, Theme } from '../types/SettingType';
import { Countries, SEbaySearch } from '../server/EbayApi/EbaySaverState';
import { EbaySearch } from "../types/EbayApiTypes/ebaySeachTypes";
import { FavouriteQueryType, FavouriteQueriesType } from '../server/setting/favouriteQueries';
import axios from "axios";
import { AxiosContext } from "./useAxios";
import { Categories } from "../server/setting/categoryManager";

export type StateContextType = {
        userData: UserData
        handleUserData: Dispatch<UserDataActionType>
    }

export type UserDataActionType = 
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
        if (actions.type === "updateTheme") {
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

        localStorage.setItem("userData", JSON.stringify(newState))
        return newState
    }

    const [userData, handleUserData] = useReducer(
        userStateReducer,
        serverData,
        (serverData) => 
        {
            const userData = JSON.parse(localStorage.getItem("userData") ?? "{}")
            return Object.assign(userData, serverData)
        }
    )

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
