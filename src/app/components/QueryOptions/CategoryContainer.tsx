import { useQueryState } from "@/app/hooks/useQueryState";
import { extractCategoryDistributions } from "../../actions/utils";
import { Category, CategoryDistribution } from "../../types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";
import { useEffect, useRef } from "react";
import { SEbaySearch } from "@/app/server/EbayApi/EbaySaverState";

export function Category_button({cat, setCategory}: 
    {
        cat: Category,
        setCategory: (categoryId: string) => void
    }
    ) 

{
    return (
        <div key={cat.categoryId}>
            <a onClick={() => { setCategory(cat.categoryId)}}>
                {cat.categoryName}
            </a>
        </div>
    )
}

export default function CategoryContainer({setCategory}: 
    {
        // categories: Category[],
        setCategory: (categoryId: string) => void
    }) {

    const { state, resp, cacheCategories } = useQueryState()

    logging.debug("Parsing category: ", cacheCategories.current)

    // Caches the categories and expects the parent to update
    
    const CATEGORY_LIMIT = 10;
    const reactCategories = []
    const hiddenCategories = []

    for (let category_counter = 0; category_counter < cacheCategories.current.length; category_counter++) {
        const category = cacheCategories.current[category_counter];
        reactCategories.push(
            <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
        )
    } 

    return reactCategories
}
