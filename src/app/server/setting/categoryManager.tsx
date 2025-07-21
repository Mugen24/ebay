import logging from "@/app/utils/logger"
import { Outcome } from "@/app/types/Outcome"
import { MarketplaceId } from '../../types/marketplaceIds';
import { GetCategoryTreeResponse } from "@/app/types/EbayApiTypes/CategoryTree"
import { GetDefaultCategoryTreeResponse } from '../../types/EbayApiTypes/CategoryTree';
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import { Database } from "sqlite";
import { Setting } from "./settings";
import { assert } from "console";

export type CategoryId = number
export type CategoryName = string
export type Categories = GetCategoryTreeResponse


export class CategoryManager{
    categories: Categories 
    marketplaceId: MarketplaceId
    rootCategoryId: string 
    db: Database

    private constructor(setting: Setting, database: Database, rootCategoryId: string, categories: Categories) {
        this.marketplaceId = setting.setting.marketPlaceId
        this.rootCategoryId = rootCategoryId
        this.db = database
        this.categories = categories
    }

    async update(): Promise<Categories> {
        const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
            "marketplace_id": this.marketplaceId
        }) 
        assert(outcome)

        if(this.rootCategoryId !== rootCat.categoryTreeVersion) {
            logging.debug("Fetching new cat")
            this.rootCategoryId = rootCat.categoryTreeId
            const [outcome, categories]= await ebayApi.getCategoryTree({
                "category_tree_id": this.rootCategoryId
            })

            assert(outcome)

            this.categories = categories 
            // this.saveCategories(categories)
        } 

        return this.categories

    }


    static async init(setting: Setting, database: Database) {
        const data = await database.get(`
            select version, categories from Categories
        `) 

        const version = data ? data.version : null
        const categories= data ? data.categories : null

        const categoriesManager = new CategoryManager(setting, database, version, categories) 
        await categoriesManager.update()
        return categoriesManager
    }

    saveCategories(categories: Categories) {
        // writeFile(CategoryManager.CATEGORIES_PATH, JSON.stringify(categories))
        assert(false)
    }
}

