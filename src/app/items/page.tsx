"use client"

import { EventHandler, MutableRefObject, useEffect, useRef, useState } from "react"
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/ebaySeachTypes";
import axios, { Axios, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { baseAxios } from "../EbayAxios";
import { formToJSON } from "axios";
import { AxiosSearch, EbayItem } from "../EbayItem";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "../page";

function SideBar(
        { ebayAxios, categoriesResponse, setSearchResponse }: 
        { 
            ebayAxios: MutableRefObject<AxiosSearch>,
            categoriesResponse: MutableRefObject<AxiosResponse>,
            setSearchResponse: (res: AxiosResponse) => void
        }
    ) {
    
    const axiosResponse = categoriesResponse;
    const data: EbaySearchReturn = axiosResponse.current.data;

    function refineCategoryItemCall(categories_id: string) {
        const categories: Record<string, any> = {}
        data.refinement.categoryDistributions.forEach(category => {
            categories[category.categoryId] = category
        })

        return () => {
            ebayAxios.current.addEntry( "category_ids",categories_id)
            ebayAxios.current.search()
            .then(res => {
                setSearchResponse(res);
            })
        }
    }

    const reactCategories = []
    if (data.refinement !== undefined) {
        if (data.refinement.categoryDistributions !== undefined) {
            for (const cat of data.refinement.categoryDistributions) {
                reactCategories.push(
                    <div key={cat.categoryId}><a onClick={refineCategoryItemCall(cat.categoryId)}>{cat.categoryName}</a></div>
                )
            }
        }

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

function Filter({axiosSearch, setSearchResponse}: {
    axiosSearch: MutableRefObject<AxiosSearch>
    setSearchResponse: (res: AxiosResponse) => void
}) {
    function addParamsAndLoad(key: keyof EbaySearch, value: any) {
        axiosSearch.current.addEntry(key, value)
        axiosSearch.current.search()
        .then((value) => {
            setSearchResponse(value)
        })
    }

    function handleSort(event: any) {
        console.log(event.target.value)
        axiosSearch.current.addEntry("sort", event.target.value)
        axiosSearch.current.search()
        .then(value => setSearchResponse(value))
    }

    function handleType(type: string) {
        axiosSearch.current.addEntry("filter", type)
        axiosSearch.current.search()
        .then(value => setSearchResponse(value))
    }

    return (
    <>
        <button onClick={() => {handleType("buyingOptions:{FIXED_PRICE|BEST_OFFER|AUCTION}")}}>All</button>
        <button onClick={() => {handleType("buyingOptions:{AUCTION}")}}>AUCTION</button>
        <button onClick={() => {handleType("buyingOptions:{FIXED_PRICE|BEST_OFFER}")}}>Buy It Now</button>

        <label htmlFor="sort-options">Sort</label>
        <select name="sort-options" id="sort-options" onChange={handleSort}>
            <option value={"newlyListed"}>Time: Newly Listed</option>
            <option value={"endingSoonest"}>Time: Ending Soonest</option>
            <option value={"price"}>Price + Postage: Lowest First</option>
        </select>
    </>
    )
}

export default function Dashboard () {
    const [ searchResponse, setSearchResponse ]: [ AxiosResponse | undefined, any] = useState()
    const categoriesResponse: MutableRefObject<AxiosResponse> | MutableRefObject<undefined> = useRef()
    const axiosSearch = useRef(new AxiosSearch())
    const searchParams = useSearchParams()
    const refSearchForm: MutableRefObject<HTMLFormElement| null> = useRef(null)

    function onclick() {
        if (refSearchForm.current === null) {
            throw new Error("Ref is null")
        }

        const queries: EbaySearch = formToJSON(new FormData(refSearchForm.current))
        queries["fieldgroups"] = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"
        console.log(queries)
        axiosSearch.current.setParams(queries)
        axiosSearch.current.search()
        .then(value => {
            categoriesResponse.current = value
            setSearchResponse(value)
        })
    }

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