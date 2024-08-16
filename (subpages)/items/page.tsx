"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { CategoryDistribution, EbaySearch, EbaySearchReturn, ItemSummary, SortField } from "../../src/app/types/ebaySeachTypes";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "../../src/app/page";
import { EbaySaverState } from "../../src/app/ebay/Ebay";
import React from "react";

export function Category_button({cat, ebaySaverState}: 
    {
        cat: CategoryDistribution,
        ebaySaverState: EbaySaverState
    }
    ) 

{

    return (
        <div key={cat.categoryId}>
            <a onClick={() => {
                ebaySaverState.data["category_ids"] = cat.categoryName 
                }
            }>

            {cat.categoryName}

            </a>
        </div>
    )
}

function SideBar(
        { categories, ebaySaverState }: 
        { 
            categories: EbaySearchReturn["refinement"]["categoryDistributions"],
            ebaySaverState: EbaySaverState
        }
    ) {
    

    const reactCategories = []
    for (const cat of categories) {
        reactCategories.push(
            <Category_button cat={cat} ebaySaverState={ebaySaverState}></Category_button>
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


function Filter({ebaySaverState}: {
    ebaySaverState: EbaySaverState,
}) {


    const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof Element) {
            const params = event.target.nodeValue;
            ebaySaverState["data"]["filter"] = `buyingOptions:{${params}}`
        }
    }

    const sortOptionsHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void = (event) => {
        // if (event.target instanceof Element) {
        //     const params = event.target.nodeValue;
        //     ebaySaverState["data"]["sort"] = params as SortField;
        // }
        if (event.target instanceof HTMLSelectElement) {
            const choice = event.target.value;
            ebaySaverState["data"]["sort"] = choice as SortField;
        }
    }


    return (
    <>
        <button value="FIXED_PRICE|BEST_OFFER|AUCTION" onClick={buyingOptionsHandler}>All</button>
        <button value="AUCTION" onClick={buyingOptionsHandler}>AUCTION</button>
        <button value="FIXED_PRICE|BEST_OFFER" onClick={buyingOptionsHandler}>Buy It Now</button>

        <label htmlFor="sort-options">Sort</label>
        <select name="sort-options" id="sort-options" onChange={sortOptionsHandler}>
            <option value={"newlyListed"}>Time: Newly Listed</option>
            <option value={"endingSoonest"}>Time: Ending Soonest</option>
            <option value={"price"}>Price + Postage: Lowest First</option>
        </select>

        <button onClick={ebaySaverState.saveToConfig}>Save Search</button>
    </>
    )
}

export default function Gallery() {
    const [searchParams , setSearchParams]= useState(new EbaySaverState(useSearchParams()));

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