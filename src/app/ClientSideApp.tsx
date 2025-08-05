'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/baseComponents/SearchBar";
import styles from "./structure.module.css";
import { SavedQueryGallery } from "./server/SavedQueryGalleryClient";
import { CategoriesList } from "./components/baseComponents/CategoriesList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";



export default function ClientSideApp({children}: {children?: ReactNode}) {
    return (
        <div className="">
          <CategoriesList/>
          <section className="">
            <SearchBar></SearchBar>
          </section>
          <section>
            {/* <SavedQueryGallery/> */}
          </section>
          {children}
        </div > 
    )
}
