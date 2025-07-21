import { useStateManager } from "@/app/hooks/useStateManagement";
import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import Link from "next/link";


export function CategoriesList() {
    const { categories } = useStateManager()
    // const [categoryId, setCategoryIds] = useState()
    const catElements: ReactElement[] = []

    // function onClick(categoryId: string) {
    //     console.log("Category click")
    //     const params: EbaySearch = {
    //         q: "",
    //         category_ids: categoryId
    //     }
    //     const searchParam = new URLSearchParams(params as Record<string, any>)
    //     window.location.href = `/items` + "?" + searchParam.toString();
    // }

    categories.rootCategoryNode.childCategoryTreeNodes.forEach((category, index) => {
        catElements.push(
            <Link 
                        key={index} 
                        // onClick={() => onClick(category.category.categoryId)}
                        href={{
                            pathname: "/items",
                            query: {
                                q: "",
                                category_ids: category.category.categoryId
                            }
                        }}
                      >
                        {category.category.categoryName}
                      </Link>
        )
    })

    return (
        <>
            {catElements}
        </>
    )
}
