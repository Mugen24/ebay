"use client"
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { clientApiManager } from "../utils/clientApiManager";
import { Categories } from "../server/setting/categoryManager";

type CategoryContextType = {
    categories: Categories
}
const CategoryContext = createContext({})

export function CategoryProvider({children}: {children: ReactNode}) {
    const [categories, _setCategories] = useState<Categories>()
    useEffect(() => {
        (async () => {
            const [outcome, categories] = await clientApiManager.getCategories()
            if (outcome) {
                _setCategories(categories)
            }
        })()
    }, [])


    if (!categories) {
        return (
            <h1>Loading categories...</h1>
        )
    }

    const value: CategoryContextType = {
        categories
    }

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    )
}


export const useCategories = () => useContext(CategoryContext) as CategoryContextType
