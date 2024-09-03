import { Category_button } from "../(subpages)/items/page";
import { extractCategoryDistributions } from "../actions/utils";
import { Category, CategoryDistribution } from "../types/ebaySeachTypes";

export default function CategoryContainer({categories, setCategory}: 
    {
        categories: CategoryDistribution[],
        setCategory: (categoryId: string) => void
    }) {
    
    const CATEGORY_LIMIT = 10;
    const reactCategories = []
    const hiddenCategories = []

    categories.sort((a, b) => {
        return Number(b.matchCount) - Number(a.matchCount)
    })

    for (let category_counter = 0; category_counter < categories.length; category_counter++) {
        const category = categories[category_counter];
        reactCategories.push(
            <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
        )
    } 
    return reactCategories
}