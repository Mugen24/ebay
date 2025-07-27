import { useStateManager } from "@/app/hooks/useStateManagement";
import { ReactElement } from "react";
import Link from "next/link";


export function CategoriesList() {
    const { userData } = useStateManager()
    // const [categoryId, setCategoryIds] = useState()
    const catElements: ReactElement[] = []
    const categories = userData.categories

    categories.rootCategoryNode.childCategoryTreeNodes.forEach((category, index) => {
        catElements.push(
<Link 
            className="
                border-solid
                border-2
                p-1
                rounded-xl
                hover:border-white
                hover:text-white
            "
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
        <div
            className="
                p-2
                mb-2
                mx-0
                mt-0
                flex
                flex-wrap
                gap-1
            "
        >
            {catElements}
        </div>
    )
}
