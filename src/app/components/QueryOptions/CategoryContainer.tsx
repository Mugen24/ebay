import { useQueryState } from "@/app/hooks/useQuerytState";
import { extractCategoryDistributions } from "../../actions/utils";
import { Category, CategoryDistribution } from "../../types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";
import { useEffect, useRef } from "react";
import { SEbaySearch } from "@/app/EbayApi/EbaySaverState";

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

export default function CategoryContainer({categories, setCategory}: 
    {
        categories: Category[],
        setCategory: (categoryId: string) => void
    }) {

    const { state } = useQueryState()
    const cacheCategories = useRef<Category[]>([])

    logging.debug("Parsing category: ", categories)

    // Caches the categories and expects the parent to update
    if (categories) {
        cacheCategories.current = categories
    } 
    
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
