'use client'
import React, { ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import styles from "./structure.module.css";


export default function ClientSideApp({children}: {children?: ReactNode}) {
    return (
      <div className={styles.main_layout}>
        <section className={styles.center_content}>
          <SearchBar></SearchBar>
        </section>

        {children}
      </div > 
    )
}