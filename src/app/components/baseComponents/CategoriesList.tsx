import { useStateManager } from "@/app/hooks/useStateManagement";
import { ReactElement } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useQueryState } from "@/app/hooks/useQueryState";
import { cn } from "@/lib/utils";

export type CategoryType = {
    categoryID: string,
    categoryName: string
}

export type CategoriesListType = {
    staticCategories?: CategoryType[]
}
// Current function is dependent too much 
// on the state of useQueryState
// Making it difficult to use out of that context
// --- Override using staticCategories ----

export function CategoriesList({className, override}: {className: string, override?: CategoriesListType}) {
    const { userData } = useStateManager()
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

    function onRemove(categoryID: string, categoryName: string) {
        queryHandler({
            "type": "updateCategory",
            "results": undefined
        })
    }

    if (override?.staticCategories) {
        for (const category of override.staticCategories)  {
            catElements.push(
                <CategoryButton 
                            key={category.categoryID}
                            categoryID={category.categoryID}
                            categoryName={category.categoryName}
                            onClick={onClick}
                            onRemove={onRemove}
                          />

            )

        }
    }
    else if(!response?.refinement.categoryDistributions) {
        for (const category of rootCategories.rootCategoryNode.childCategoryTreeNodes){
                catElements.push(
                    <CategoryButton 
                                key={category.category.categoryId}
                                categoryID={category.category.categoryId}
                                categoryName={category.category.categoryName}
                                onClick={onClick}
                                onRemove={onRemove}
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
                            onRemove={onRemove}
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
            className={cn("p-2 mb-2 mx-0 mt-0 flex flex-row gap-1 flex-wrap", className)}
        >
            {catElements}
        </div>
    )
}

export function CategoryButton({categoryID, categoryName, onClick, onRemove}: {
    categoryID: string,
    categoryName: string
    onClick: (categoryID: string, categoryName: string) => void
    onRemove: (categoryID: string, categoryName: string) => void
}) {
    const {queryState} = useQueryState()

    const isCurrentCat = queryState.category_ids == categoryID

    return (
        <Button variant={ isCurrentCat ? "default" : "ghost"} 
            onClick={(e) => {
                if (!isCurrentCat) {
                    onClick(categoryID, categoryName)
                } else {
                    onRemove(categoryID, categoryName)
                }
            }}
            className="
                border-solid
                border-2
                p-1
                rounded-xl
                w-fit
                text-[60%]
            "
            size="sm"
        >
            {`${categoryName}`}
        </Button>
    )
}
