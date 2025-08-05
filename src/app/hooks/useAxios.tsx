"use client";
import { createContext, ReactNode, useRef, MutableRefObject, useContext } from 'react';
import axios, { Axios, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import logging from '../utils/logger';
export type AxiosContextType = {
    updateConfig: (config: AxiosRequestConfig) => void,
    getAxios: () => Axios
    getConfig: () => AxiosRequestConfig
}

export const AxiosContext = createContext<AxiosContextType | undefined>(undefined)

export function AxiosProvider({children}: {children: ReactNode})  {
    const base_config: MutableRefObject<AxiosRequestConfig> = useRef({
        baseURL: "/server/api/",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const axios = new Axios(base_config.current)
    // axios.defaults.baseURL = base_config.current.baseURL

    // TODO: move all the ebay request merging logic in 
    // axios instead ??
    axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        logging.debug(`${config.method}: ${config.url}`)
        Object.assign(base_config.current, config)
        return config
    })
    axios.interceptors.response.use((resp) => {
        logging.debug(`RESP: ${resp.request.method}: ${resp.request.url} ${resp.status}`)
        return resp
    })

    function updateConfig(config: AxiosRequestConfig) {
        base_config.current = Object.assign(base_config.current, config)
    }

    function getAxios() {
        return axios
    }

    function getConfig() {
        return base_config.current
    }

    const value = {
        updateConfig,
        getAxios,
        getConfig
    }

    return <AxiosContext.Provider value={value}>
        {children}
    </AxiosContext.Provider>
}

export const useAxios = () => useContext(AxiosContext) as AxiosContextType