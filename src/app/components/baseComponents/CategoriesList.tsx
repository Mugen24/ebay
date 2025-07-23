import { useStateManager } from "@/app/hooks/useStateManagement";
import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import Link from "next/link";


export function CategoriesList() {
    const { userData } = useStateManager()
    // const [categoryId, setCategoryIds] = useState()
    const catElements: ReactElement[] = []
    const categories = userData.categories

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
