import { Category_button } from "../(subpages)/items/page";
import { extractCategoryDistributions } from "../actions/utils";
import { Category, CategoryDistribution } from "../types/ebaySeachTypes";

function main({categories, setCategory}: 
    {
        categories: CategoryDistribution[],
        setCategory: () => {}
    }) {
    
    const CATEGORY_LIMIT = 10;
    const reactCategories = []

    categories.sort((a, b) => {
        return Number(a.matchCount) - Number(b.matchCount)
    })

    for (let category_counter = 0; category_counter < CATEGORY_LIMIT; category_counter++) {
        const category = categories[category_counter];
        reactCategories.push(
            <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
        )
    }
}