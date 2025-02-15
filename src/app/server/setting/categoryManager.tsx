import { readFileSync, writeFileSync } from "node:fs"
import { Setting } from "./settings"
import logging from "@/app/utils/logger"
import path from "node:path"
import { Outcome } from "@/app/types/Outcome"
import { ebayApiToken } from "@/app/EbayApi/EbayApi"
import { MarketplaceId } from '../../types/marketplaceIds';
import { GetCategoryTreeResponse } from "@/app/types/EbayApiTypes/CategoryTree"

export type CategoryId = number
export type CategoryName = string
export type Categories = GetCategoryTreeResponse

function loadOrMakeFile(path: string): string {
    try {
        const file = readFileSync(path, {
            encoding: "utf-8"
        })
        return file
    } catch (error: any) {
        if (error.code === "ENOENT") {
            writeFileSync(Setting.SETTING_PATH, "", {encoding: "utf8"})
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

export class CategoryManager{
    categories?: Categories 
    marketplaceId: MarketplaceId
    categoryVersion: string | undefined
    rootCategoryId: string | undefined
    static CachePath = process.env.CACHE_PATH ?? "./config/cache"

    constructor(marketPlaceId: MarketplaceId) {
        this.marketplaceId = marketPlaceId
    }

    getCategoryVersion(marketPlaceId: MarketplaceId) {
        return 
    }

    async isCategoriesUptoDate(): Promise<Boolean> {
        const ebayApi = await ebayApiToken
        const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
            "marketplace_id": this.marketplaceId
        }) 
        if (outcome) {
            if(this.categoryVersion === rootCat.categoryTreeVersion) {
                return true
            } else {
                this.rootCategoryId = rootCat.categoryTreeId

                // Should only be set updating categories
                // this.categoryVersion = rootCat.categoryTreeVersion
            }
        }
        return false
    }

    async updateCategories() {
        const ebayApi = await ebayApiToken
        let rootId: string | undefined;
        if (this.rootCategoryId) {
            rootId = this.rootCategoryId
        } else {
            const [outcome, rootCat] = await ebayApi.getDefaultCategoryTree({
                "marketplace_id": this.marketplaceId
            })
            rootId = outcome ? rootCat.categoryTreeId : undefined
        }

        if (!rootId) return false

        const [outcome, categories]= await ebayApi.getCategoryTree({
            "category_tree_id": rootId
        })
        if (outcome) {
            this.categories = categories 
            this.saveCategories(categories)
        } else {
            this.categories = undefined
        }
        return outcome
    }

    loadCategories(): Outcome<Categories | {}> {
        logging.debug("Loading cache: ", path.resolve(CategoryManager.CachePath))
        try {
            const categories: Categories = JSON.parse(loadOrMakeFile(`${CategoryManager.CachePath}/categories.json`) ?? {})
            return [true, categories]
        } catch (error){
            logging.error("Can't fetch cache categories: ", error)
            return [false, {}]
        }
    }

    saveCategories(categories: Categories) {
        writeFile(CategoryManager.CachePath, JSON.stringify(categories))
    }

}
