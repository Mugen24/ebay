import { useQueryState } from "@/app/hooks/useQuerytState";
import { extractCategoryDistributions } from "../../actions/utils";
import { Category, CategoryDistribution } from "../../types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";

export function Category_button({cat, setCategory}: 
    {
        cat: CategoryDistribution,
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
        setCategory: (categoryId: string) => void
    }) {

    const {resp} = useQueryState()
    const categories = resp["refinement"]?.["categoryDistributions"] ?? [];
    logging.debug("Parsing category: ", categories)
    
    const CATEGORY_LIMIT = 10;
    const reactCategories = []
    const hiddenCategories = []

    // The return categories is already sorted 
    // categories.sort((a, b) => {
    //     return Number(b.matchCount) - Number(a.matchCount)
    // })

    for (let category_counter = 0; category_counter < categories.length; category_counter++) {
        const category = categories[category_counter];
        reactCategories.push(
            <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
        )
    } 

    return reactCategories
}