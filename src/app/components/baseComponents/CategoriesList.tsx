import { useStateManager } from "@/app/hooks/useStateManagement";
import { ReactElement } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useQueryState } from "@/app/hooks/useQueryState";


export function CategoriesList() {
    const { userData } = useStateManager()
    // const [categoryId, setCategoryIds] = useState()
    const catElements: ReactElement[] = []
    const { queryHandler, response } = useQueryState()
    const rootCategories = userData.categories

    const MAX_CATEGORIES = 20

    function onClick(categoryID: string, categoryName: string) {
        queryHandler({
            "type": "updateCategory",
            "results": categoryID
        })
    }

    if (!response?.refinement.categoryDistributions) {
        for (const category of rootCategories.rootCategoryNode.childCategoryTreeNodes){
                catElements.push(
                    <CategoryButton 
                                key={category.category.categoryId}
                                categoryID={category.category.categoryId}
                                categoryName={category.category.categoryName}
                                onClick={onClick}
                              />

                )
        }
    } else {
       const categories = response.refinement.categoryDistributions 
       let index = 0
       for (const item of categories) {
            catElements.push(
                <CategoryButton 
                            key={item.categoryId}
                            categoryID={item.categoryId}
                            categoryName={item.categoryName}
                            onClick={onClick}
                        />
            )
            index ++
            if (index > MAX_CATEGORIES) {
                break
            }
        }
    }

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

export function CategoryButton({categoryID, categoryName, onClick}: {
    categoryID: string,
    categoryName: string
    onClick: (categoryID: string, categoryName: string) => void
}) {
    const {queryState} = useQueryState()

    const isCurrentCat = queryState.category_ids == categoryID

    return (
        <Button variant={ isCurrentCat ? "default" : "ghost"} 
            onClick={(e) => {
                onClick(categoryID, categoryName)
            }}
            className="
                border-solid
                border-2
                p-1
                rounded-xl
            "
        >
            {`${categoryName}`}
        </Button>
    )
}