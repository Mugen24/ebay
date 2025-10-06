'use client'
import React, { Context, createContext, Dispatch, ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/baseComponents/SearchBar";
import styles from "./structure.module.css";
import { CategoriesList } from "./components/baseComponents/CategoriesList";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { WatchedItemGallery } from "./components/WatchedItems/WatchedItemsGallery";
import { SSEProvider } from "./hooks/useSSE";
import { WatchedCategoriesRoot } from "./components/WatchedCategories/WatchCategoriesGallery";



export default function ClientSideApp({children}: {children?: ReactNode}) {
    return (
        <div className="">
          <CategoriesList/>
          <section className="">
            <SearchBar></SearchBar>
          </section>
          <section>
            <WatchedItemGallery></WatchedItemGallery>
          </section>
          {children} 
          <WatchedCategoriesRoot/>
        </div > 
    )
}
