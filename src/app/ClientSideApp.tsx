'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import styles from "./structure.module.css";
import { EbaySaverState } from "./EbayApi/EbaySaverState";

export type HomePageContextType = {
  ebayState: EbaySaverState,
  setEbayState: Dispatch<EbaySaverState>
} | {}

export const HomePageContext: Context<HomePageContextType> = createContext({})

export default function ClientSideApp({children}: {children?: ReactNode}) {
    const [ebayState, setEbayState] = useState(new EbaySaverState())

    return (
      <HomePageContext.Provider value={{
        ebayState,
        setEbayState
      }}>
        <div className={styles.main_layout}>
          <section className={styles.center_content}>
            <SearchBar></SearchBar>
          </section>
          {children}
        </div > 
      </HomePageContext.Provider>
    )
}