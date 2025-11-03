import logging from "@/app/utils/logger"
import { MarketplaceId } from '../../types/marketplaceIds';
import { GetCategoryTreeResponse } from "@/app/types/EbayApiTypes/CategoryTree"
import { Database } from "sqlite";
import { Setting } from "./settings";
import { assert } from "console";
import { ebayApi } from "../EbayApi/EbayApi";

export type CategoryId = number
export type CategoryName = string
export type Categories = GetCategoryTreeResponse


export class CategoryManager {
    categories: Categories 
    marketplaceId: MarketplaceId
    categoryTreeVersion: string 
    db: Database

    private constructor(database: Database, setting: Setting, categoryTreeVersion: string, categories: Categories) {
        this.db = database
        this.marketplaceId = setting.setting.marketPlaceId
        this.categoryTreeVersion = categoryTreeVersion
        // this.db = database
        this.categories = categories
    }

    async update(): Promise<Categories> {
        const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
            "marketplace_id": this.marketplaceId
        }) 
        assert(outcome)

        if(this.categoryTreeVersion !== rootCat.categoryTreeVersion) {
            logging.debug("Fetching new cat")
            this.categoryTreeVersion = rootCat.categoryTreeVersion

            const [outcome, categories]= await ebayApi.getCategoryTree({
                "category_tree_id": rootCat.categoryTreeId
            })

            assert(outcome)
            this.categories = categories 

            await this.save(this.categoryTreeVersion, this.categories)
        } 

        return this.categories

    }

    static async init(setting: Setting, database: Database) {
        const data = await database.get(`
            select version, categories from Categories
        `) 

        const version = data ? data.version : null
        const categories= data ? JSON.parse(data.categories) : null

        const categoriesManager = new CategoryManager(database, setting, version, categories) 
        await categoriesManager.update()
        return categoriesManager
    }

    async save(version: string, categories: Categories) {
        // writeFile(CategoryManager.CATEGORIES_PATH, JSON.stringify(categories))
        this.db.run(`
            insert or replace into categories (version, categories) values (?, ?)
        `, [version, JSON.stringify(categories)])
    }
}

