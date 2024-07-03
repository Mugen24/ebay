import { Key } from "react";
import { Category, CategoryDistribution, EbaySearch, EbaySearchReturn, Image, ItemSummary } from "./types/ebaySeachTypes";
import { Axios } from "axios";
import { baseAxios } from "./EbayAxios";
import { url } from "inspector";
import { URLSearchParamsToJson } from "./utils";

type ebayLink = string;
type CategoryId = string;
type CatagoryName = string;

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



export class _EbaySearchConfig {
    _data: EbaySearch
    _tempData: EbaySearch
    constructor (res: EbaySearch) {
        this._data = {
            q: res.q,
            category_ids: res.category_ids,
        }

        this._tempData = Object.fromEntries(Object.entries(res).filter(([key]) => {
            return !(key in Object.keys(this._data))
        }))

    }

    addEntry <Key extends keyof EbaySearch> (key: Key, value: EbaySearch[Key]) {
        this._data[key] = value
    }
    addTempEntry <Key extends keyof EbaySearch> (key: Key, value: EbaySearch[Key]) {
        this._tempData[key] = value
    }
    flushTempEntries () {
        this._tempData = {}
    }
    toJson() {
        return Object.assign({}, this._data, this._tempData)
    }
}

export class EbaySearchConfig{
    searchConfig: _EbaySearchConfig | undefined
    constructor () {
        this.searchConfig = undefined
    }

    setParams (request: EbaySearch) {
        this.searchConfig = new _EbaySearchConfig(request)
    }

    addEntry (key: keyof EbaySearch, value: any) {
        this.searchConfig?.addEntry(key, value)
    }

    addTempEntry (key: keyof EbaySearch, value: any) {
        this.searchConfig?.addTempEntry(key, value)
    }

    flushTempEntry () {
        this.searchConfig?.flushTempEntries()
    }

    //Remove tempEntry after being called
    toJson () {
        if (this.searchConfig === undefined) {
            throw new Error("Item Params has not been set up")
        }
        //Add some default value
        if (this.searchConfig._data["filter"] === undefined) {
            this.searchConfig.addTempEntry("filter", "conditions:{USED|UNSPECIFIED}")
        } else {
            this.searchConfig.addTempEntry("filter", this.searchConfig._data["filter"]+",conditions:{USED|UNSPECIFIED}")
        }
        const data = this.searchConfig?.toJson();
        this.flushTempEntry()
        return data;
    }
}