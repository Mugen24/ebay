import { Key } from "react";
import { Category, CategoryDistribution, EbaySearch, EbaySearchReturn, Image, ItemSummary } from "../types/ebaySeachTypes";
import { url } from "inspector";
import { URLSearchParamsToJson } from "../utils";

type ebayLink = string;
type CategoryId = string;
type CatagoryName = string;

export class Ebay {

}



export class EbayItem {
    title: string;
    images: Image[];
    description: string;
    url: ebayLink;
    epid: string;
    price: number;
    others?: ItemSummary;


    constructor(title: string, images: Image[], description: string, url: string, epid: string, price: number, others: ItemSummary) {
        this.title= title
        this.images = images
        this.description = description
        this.url = url
        this.epid = epid
        this.price = price
        this.others = others
    }

    static fromItemSummary(item: ItemSummary) {
        return new EbayItem(
            item.title,
            item.additionalImages.concat([item.image]),
            item.shortDescription,
            item.itemHref,
            item.epid,
            Number(item.price),
            item
        )
    }

}

export class EbayUtils {
    static GetAllCategories(ebayResponse: EbaySearchReturn): Record<CategoryId, CatagoryName> {
        const categories: CategoryDistribution[] = ebayResponse.refinement.categoryDistributions
        const categoriesContainer: Record<CategoryId, CatagoryName>  = {}
        for (const {categoryId, categoryName} of categories) {
            categoriesContainer[categoryId] = categoryName
        }
        return categoriesContainer
    }
}
