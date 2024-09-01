import { extractCategoryDistributions } from "../actions/utils";
import { EbaySearchReturn } from "../types/ebaySeachTypes";
import { Category_button } from "../(subpages)/items/page";
import { getCategories } from "../actions/EbayApiWrapper";

const CATEGORY_LIMIT = 10;
function CategoryComponent({ebaySearchReturn, setCategory}:
    {
        ebaySearchReturn: EbaySearchReturn,
        setCategory: ()=>{}
    }
) {

    const dominantCategory = ebaySearchReturn.refinement.dominantCategoryId;
    const categories = extractCategoryDistributions(ebaySearchReturn)
    categories.sort((a, b) => {
        const countA = Number(a.matchCount)
        const countB = Number(b.matchCount)
        return (countA - countB)
    })

    const truncatedCategories = categories.slice(0, CATEGORY_LIMIT);

    for (let category of truncatedCategories) {
        getCategories(category.categoryId)
    }



    const reactCategories = []
    for (let category_counter = 0; category_counter < categories.length; category_counter++) {
        if (category_counter < CATEGORY_LIMIT) {
            const category = categories[category_counter];
            reactCategories.push(
                <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
            )
        } else {
            reactCategories.push(<button>...</button>)
        }
    }

}
