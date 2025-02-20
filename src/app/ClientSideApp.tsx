'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import styles from "./structure.module.css";
import { EbaySaverState } from "./EbayApi/EbaySaverState";
import { SavedQueryGallery } from "./server/SavedQueryGalleryClient";
import { useCategories } from "./hooks/useCategories";



export default function ClientSideApp({children}: {children?: ReactNode}) {
    const {categories} = useCategories()
    console.log(categories)
    return (
        <div className={styles.main_layout}>
          <section className={styles.center_content}>
            <SearchBar></SearchBar>
          </section>
          <section>
            <SavedQueryGallery/>
          </section>
          {children}
        </div > 
    )
}
