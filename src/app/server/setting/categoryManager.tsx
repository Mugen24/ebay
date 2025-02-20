import { readFileSync, writeFileSync } from "node:fs"
import logging from "@/app/utils/logger"
import { Outcome } from "@/app/types/Outcome"
import { MarketplaceId } from '../../types/marketplaceIds';
import { GetCategoryTreeResponse } from "@/app/types/EbayApiTypes/CategoryTree"
import { GetDefaultCategoryTreeResponse } from '../../types/EbayApiTypes/CategoryTree';
import path from "node:path";
import { setting } from "./settings";
import { ebayApi } from "@/app/EbayApi/EbayApi";

export type CategoryId = number
export type CategoryName = string
export type Categories = GetCategoryTreeResponse

function loadOrMakeFile(path: string, data?: string): string {
    try {
        const file = readFileSync(path, {
            encoding: "utf-8"
        })
        return file
    } catch (error: any) {
        logging.debug(JSON.stringify(error))
        if (error.code === "ENOENT") {
            writeFileSync(path, data ?? "", {
                encoding: "utf8",
                flag: "w+"
            })
            return ""
        } else {
            throw error
        }
    }
}

function writeFile(path: string, data: string) {
    try {
        writeFileSync(path, data, {
            encoding: "utf8",
            flag: "w+"
        })
    } catch (error) {
        logging.error("Unable to write to file:", path)
        logging.error(error)
    }
}

class CategoryManager{
    categories?: Categories 
    marketplaceId: MarketplaceId
    categoryVersion: string | undefined
    rootCategoryId: string | undefined
    static CATEGORIES_PATH = process.env.CACHE_PATH ?? "./config/category/categories.json"
    static CATEGORIES_VERSION_PATH = process.env.CACHE_PATH ?? "./config/category/version.json"

    private constructor(marketPlaceId: MarketplaceId) {
        this.marketplaceId = marketPlaceId
    }

    async isCategoriesUptoDate(): Promise<Boolean> {
        const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
            "marketplace_id": this.marketplaceId
        }) 
        if (outcome) {
            if(this.categoryVersion === rootCat.categoryTreeVersion) {
                return true
            } else {
                this.rootCategoryId = rootCat.categoryTreeId
            }
        }
        return false }

    async updateCategories() {
        logging.group("Updating category")

        let rootId: string;
        if (this.rootCategoryId) {
            rootId = this.rootCategoryId
        } 
        else {
            const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
                "marketplace_id": this.marketplaceId
            })
            if (outcome) {
                rootId = rootCat.categoryTreeId
                writeFileSync(CategoryManager.CATEGORIES_VERSION_PATH, JSON.stringify(rootCat))
            } else {
                throw new Error("Cannot fetch root category")
            }
        }

        const [outcome, categories]= await ebayApi.getCategoryTree({
            "category_tree_id": rootId
        })
        if (outcome) {
            this.categories = categories 
            this.saveCategories(categories)
        } else {
            throw new Error("Cannot fetch category Tree")
        }

        logging.groupEnd()
        return outcome
    }

    static async init(marketPlaceId: MarketplaceId) {
        const versionFile = loadOrMakeFile(CategoryManager.CATEGORIES_VERSION_PATH)
        const categoriesManager = new CategoryManager(marketPlaceId) 

        if (!versionFile) {
            categoriesManager.updateCategories()
            return categoriesManager
        } else {
            const rootCat : GetDefaultCategoryTreeResponse = JSON.parse(versionFile)
            categoriesManager.categoryVersion = rootCat.categoryTreeVersion
            categoriesManager.rootCategoryId  = rootCat.categoryTreeId
        }

        const isCatUpToDate = await categoriesManager.isCategoriesUptoDate()
        if (!isCatUpToDate) {
            categoriesManager.updateCategories()
        } else {
            const [outcome, categories] = categoriesManager.loadCategories()
            if (!outcome) {
                categoriesManager.updateCategories()
            }

        }

        return categoriesManager
    }


    loadCategories(): Outcome<Categories | {}> {
        logging.debug("Loading categories: ", path.resolve(CategoryManager.CATEGORIES_PATH))
        try {
            const categories: Categories = JSON.parse(loadOrMakeFile(`${CategoryManager.CATEGORIES_PATH}`, "{}") ?? {})
            this.categories = categories
            logging.debug(this.categories)
            return [true, categories]
        } catch (error){
            logging.error("Can't fetch cache categories: ", error)
            return [false, {}]
        }
    }

    saveCategories(categories: Categories) {
        writeFile(CategoryManager.CATEGORIES_PATH, JSON.stringify(categories))
    }
}
export const categoryManager = await CategoryManager.init(setting.setting.marketPlaceId)


