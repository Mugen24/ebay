'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import styles from "./structure.module.css";
import { SavedQueryGallery } from "./server/SavedQueryGalleryClient";
import { CategoriesList } from "./components/baseComponents/CategoriesList";
import { StateProvider } from '@/app/hooks/useStateManagement';



export default function ClientSideApp({serverData, children}: {serverData: Record<string, any>, children?: ReactNode}) {
    return (
      <StateProvider serverData={serverData}>
        <div className={styles.main_layout}>
          <CategoriesList/>
          <section className={styles.center_content}>
            <SearchBar></SearchBar>
          </section>
          <section>
            <SavedQueryGallery/>
          </section>
          {children}
        </div > 
      </StateProvider>
    )
}
