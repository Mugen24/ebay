"use client"

import { ChangeEventHandler, EventHandler, MutableRefObject, SelectHTMLAttributes, useEffect, useRef, useState } from "react"
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/ebaySeachTypes";
import axios, { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { baseAxios } from "../EbayAxios";
import { formToJSON } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "../page";
import { EbaySearchConfig } from "../api/ebay/ebay";
import { handleSort, handleType, refineCategoryItemCall } from "./actions";

function SideBar(
        { setSearchResponse, itemConfig, categories}: 
        { 
            setSearchResponse: (res: EbaySearchReturn) => void
            itemConfig: EbaySearchConfig,
            categories: EbaySearchReturn["refinement"]["categoryDistributions"]
        }
    ) {
    
    const categoriesResponse = useRef<EbaySearchReturn["refinement"]["categoryDistributions"]>([])

    const reactCategories = []
    if (categories !== undefined) {
        categoriesResponse.current = categories
    }     

    for (const cat of categoriesResponse.current) {
        reactCategories.push(
    <div key={cat.categoryId}>
                <a onClick={() => {
                    refineCategoryItemCall(cat.categoryId, itemConfig)
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
            <p>{ebayItem.title}</p>
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
    searchConfig: EbaySearchConfig,
    setSearchResponse: (res: EbaySearchReturn) => void
}) {
    function _handleType(data: string) {
        handleType(data, searchConfig.toJson())
        .then(value => {
            setSearchResponse(value)
        })
    }

    function _handleSort(event: ChangeEventHandler<HTMLSelectElement>) {
        handleSort(event.value as string, searchConfig.toJson())
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
    </>
    )
}

export default function Dashboard () {
    const [ searchResponse, setSearchResponse ] = useState<AxiosResponse>()
    const categoriesResponse = useRef<AxiosResponse>()
    const searchParams = useSearchParams()
    const refSearchForm = useRef<HTMLFormElement>(null)


    useEffect(() => {
        const params: Record<keyof EbaySearch | any, any> = {};
        for (const [key, values] of searchParams) {
            params[key] = values
        }

        if ( Object.keys(params).length <= 0 ) {
            console.log("No params")
            return
        }
        axiosSearch.current.setParams(params as EbaySearch)
        axiosSearch.current.search()
        .then(value => {
            setSearchResponse(value)
        })
    }, [searchParams])

    return (
        <div>
            <SearchBar formRef={refSearchForm} onclick={onclick}/>
            {
                categoriesResponse.current !== undefined ? (
                    <SideBar ebayAxios={axiosSearch} categoriesResponse={categoriesResponse} setSearchResponse={setSearchResponse}></SideBar>
                ) : null
            }
            {
                searchResponse !== undefined ? (
                    <>
                        <div>
                            <Filter axiosSearch={axiosSearch} setSearchResponse={setSearchResponse}/>
                            <ItemsContainer getSearchResponse={searchResponse.data}></ItemsContainer>
                            <button onClick={() => {
                                axiosSearch.current.searchRaw(searchResponse.data.next)
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