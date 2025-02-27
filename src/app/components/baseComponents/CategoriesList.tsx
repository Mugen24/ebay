import { useCategories } from "@/app/hooks/useCategories";
import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";


export function CategoriesList() {
    const {categories} = useCategories()
    const [categoryId, setCategoryIds] = useState()
    const catElements: ReactElement[] = []

    function onClick(categoryId: string) {
        console.log("Category click")
        const params: EbaySearch = {
            q: "",
            category_ids: categoryId
        }
        const searchParam = new URLSearchParams(params as Record<string, any>)
        window.location.href = `/items` + "?" + searchParam.toString();
    }

    categories.rootCategoryNode.childCategoryTreeNodes.forEach((category) => {
        catElements.push(
            <button onClick={() => onClick(category.category.categoryId)}>{category.category.categoryName}</button>
        )
    })

    return (
        <>
            {catElements}
        </>
    )
}
