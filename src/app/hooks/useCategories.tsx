// "use client"
// import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
// import { clientApiManager } from "../utils/clientApiManager";
// import { Categories } from "../server/setting/categoryManager";
// 
// type CategoryContextType = 
//     | {
//         isLoading: true
//         categories: undefined
//     }
//     | {
//         isLoading: false
//         categories: Categories
//     }
// 
// const CategoryContext = createContext({})
// 
// export function CategoryProvider({children}: {children: ReactNode}) {
//     const [categories, _setCategories] = useState<Categories>()
//     const [isLoading, setIsLoading] = useState(true)
//     useEffect(() => {
//         (async () => {
//             const [outcome, categories] = await clientApiManager.getCategories()
//             if (outcome) {
//                 _setCategories(categories)
//             }
//             setIsLoading(false)
//         })()
//     }, [])
// 
// 
//     const value: CategoryContextType = useMemo(() => {
//         if (!isLoading && categories) {
//             return {
//                 isLoading: false,
//                 categories
//             }
//         } else {
//             return {
//                 isLoading: true
//             }
//         }
// 
//     }, [isLoading, categories])
// 
//     return (
//         <CategoryContext.Provider value={value}>
//             {children}
//         </CategoryContext.Provider>
//     )
// }
// 
// 
// export const useCategories = () => useContext(CategoryContext) as CategoryContextType
// 