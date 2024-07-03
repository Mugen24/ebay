"use client"

import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react"
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/ebaySeachTypes";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../page";
import { ebaySearch, handleSort, handleType, refineCategoryItemCall, saveParamsToConfig, search, searchRaw } from "./actions";
import { EbaySearchConfig } from "../EbayItem";

function SideBar(
        { setSearchResponse, itemConfig, categories}: 
        { 
            setSearchResponse: (res: EbaySearchReturn) => void
            itemConfig: MutableRefObject<EbaySearchConfig>,
            categories: MutableRefObject<EbaySearchReturn["refinement"]["categoryDistributions"]>
        }
    ) {
    

    const reactCategories = []
    for (const cat of categories.current) {
        reactCategories.push(
    <div key={cat.categoryId}>
                <a onClick={() => {
                    itemConfig.current.addEntry("category_ids", cat.categoryId)
                    ebaySearch(itemConfig.current.toJson())
                    .then(
                        data => {
                            setSearchResponse(data)
                        })
                    }}>
                    {cat.categoryName}
                </a>
            </div>
        )
    }

    return (
        <div>
            {reactCategories}
        </div>
    )
}

function Item({ ebayItem }: { ebayItem: ItemSummary }) {
    return (
        <div className="ebay-item">
            <img src={ebayItem.image.imageUrl} alt={ebayItem.title}/>
            <a href={ebayItem.itemWebUrl}><p>{ebayItem.title}</p></a>
            <p>{ebayItem.buyingOptions}</p>
            <p>{ebayItem.price.convertedFromCurrency} {ebayItem.price.convertedFromValue}</p>
            <p>{ebayItem.price.currency}: {ebayItem.price.value}</p>
            <p>Conditions: {ebayItem.condition}</p>
            <p>date: {ebayItem.itemCreationDate}</p>
            {/* <p>Shipping</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCostType}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.convertedFromCurrency}:{ebayItem.shippingOptions[0].shippingCost.convertedFromValue}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.currency}:{ebayItem.shippingOptions[0].shippingCost.value}</p> */}
        </div>
    )
}

export function ItemsContainer({getSearchResponse}: {getSearchResponse: EbaySearchReturn}) {
    if (getSearchResponse.itemSummaries === undefined) {
        console.log("No item found");
    }

    const ebayItems = [];
    for (const item of getSearchResponse.itemSummaries) {
        ebayItems.push(<Item key={item.itemId} ebayItem={item}/>)
    }

    return (
        <div id="ItemsContainer">
            {ebayItems}
        </div>
    )
}


function Filter({searchConfig, setSearchResponse}: {
    searchConfig: () => MutableRefObject<EbaySearchConfig>,
    setSearchResponse: (res: EbaySearchReturn) => void
}) {
    function _handleType(data: string) {
        handleType(data, searchConfig().current.toJson())
        .then(value => {
            setSearchResponse(value)
        })
    }

    function _handleSort(event: ChangeEvent<HTMLSelectElement>) {
        handleSort(event.target.value as string, searchConfig().current.toJson())
        .then(value => {
            setSearchResponse(value)
        })
    }
    return (
    <>
        <button onClick={() => {_handleType("buyingOptions:{FIXED_PRICE|BEST_OFFER|AUCTION}")}}>All</button>
        <button onClick={() => {_handleType("buyingOptions:{AUCTION}")}}>AUCTION</button>
        <button onClick={() => {_handleType("buyingOptions:{FIXED_PRICE|BEST_OFFER}")}}>Buy It Now</button>

        <label htmlFor="sort-options">Sort</label>
        <select name="sort-options" id="sort-options" onChange={_handleSort}>
            <option value={"newlyListed"}>Time: Newly Listed</option>
            <option value={"endingSoonest"}>Time: Ending Soonest</option>
            <option value={"price"}>Price + Postage: Lowest First</option>
        </select>

        <button onClick={() => {saveParamsToConfig(searchConfig().current.toJson())}}>Save Search</button>
    </>
    )
}

export default function Dashboard () {
    const [ searchResponse, setSearchResponse ] = useState<EbaySearchReturn>()
    const searchParams = useSearchParams();
    const searchConfig = useRef<EbaySearchConfig>(new EbaySearchConfig());
    const categoriesResponse = useRef<EbaySearchReturn["refinement"]["categoryDistributions"]>([]);

    useEffect(() => {
        const params: Record<keyof EbaySearch | any, any> = {};
        for (const [key, values] of searchParams) {
            params[key] = values
        }

        if ( Object.keys(params).length <= 0 ) {
            console.log("No params")
            return
        }

        // setSearchConfig(new EbaySearchConfig())
        searchConfig.current.setParams(params as EbaySearch)

        ebaySearch(searchConfig.current.toJson())
        .then(value => {
            setSearchResponse(value)
            categoriesResponse.current = value.refinement.categoryDistributions;
        })
    }, [searchParams])

    return (
        <div>
            <SearchBar/>
            {
                categoriesResponse.current !== undefined ? (
                    <SideBar setSearchResponse={setSearchResponse} itemConfig={searchConfig} categories={categoriesResponse}></SideBar>
                ) : null
            }
            {
                searchResponse !== undefined ? (
                    <>
                        <div>
                            <Filter searchConfig={ () => searchConfig} setSearchResponse={setSearchResponse} />
                            <ItemsContainer getSearchResponse={searchResponse}></ItemsContainer>
                            <button onClick={() => {
                                searchRaw(searchResponse.next)
                                .then(value => {
                                    setSearchResponse(value)
                                })
                            }}>Next</button>
                        </div>
                    </>
                ) : null
            }
        </div>
    )
}