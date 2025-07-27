'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/baseComponents/SearchBar";
import styles from "./structure.module.css";
import { SavedQueryGallery } from "./server/SavedQueryGalleryClient";
import { CategoriesList } from "./components/baseComponents/CategoriesList";



export default function ClientSideApp({children}: {children?: ReactNode}) {
    return (
        <div className={styles.main_layout}>
          <CategoriesList/>
          <section className={styles.center_content}>
            <SearchBar></SearchBar>
          </section>
          <section>
            {/* <SavedQueryGallery/> */}
          </section>
          {children}
        </div > 
    )
}
