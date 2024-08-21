"use client"
import { Dispatch, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation";
import { CategoryDistribution, ItemSummary, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes";
import React from "react";
import { search } from "@/app/actions/EbayApiWrapper";
import { SearchBar } from "@/app/components/SearchBar";
import { extractCategoryDistributions, extractItems, URLSearchParamsToJson } from "@/app/actions/utils";
import { EbaySaverState } from "@/app/actions/EbaySaverState";

export function Category_button({cat, setCategory}: 
    {
        cat: CategoryDistribution,
        setCategory: (categoryId: string) => void
    }
    ) 

{

    return (
        <div key={cat.categoryId}>
            <a onClick={() => { setCategory(cat.categoryId)}}>
                {cat.categoryName}
            </a>
        </div>
    )
}

function EbayItem({ ebayItem }: { ebayItem: ItemSummary }) {
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

export function ItemsContainer({ebaySearchResponse}: {ebaySearchResponse: EbaySearchReturn}) {
    const ebayItems = [];
    for (const item of extractItems(ebaySearchResponse)) {
        ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
    }

    return (
        <div id="ItemsContainer">
            {ebayItems}
        </div>
    )
}


function Filter({setFilterState, setChoiceState, saveConfigState}: {
    setFilterState: (filterArgs: string) => void,
    setChoiceState: (choiceArgs: string) => void,
    saveConfigState: () => void,
}) {
    // const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
    //     if (event.target instanceof Element) {
    //         const params = event.target.nodeValue;
    //         // ebaySaverState["data"]["filter"] = `buyingOptions:{${params}}`
    //         setFilterState(params as string)
    //     }
    // }

    // const sortOptionsHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void = (event) => {
    //     // if (event.target instanceof Element) {
    //     //     const params = event.target.nodeValue;
    //     //     ebaySaverState["data"]["sort"] = params as SortField;
    //     // }
    //     if (event.target instanceof HTMLSelectElement) {
    //         const choice = event.target.value;
    //         setChoiceState(choice);
    //     }
    // }


    // return (
    // <>
    //     <button value="FIXED_PRICE|BEST_OFFER|AUCTION" onClick={buyingOptionsHandler}>All</button>
    //     <button value="AUCTION" onClick={buyingOptionsHandler}>AUCTION</button>
    //     <button value="FIXED_PRICE|BEST_OFFER" onClick={buyingOptionsHandler}>Buy It Now</button>

    //     <label htmlFor="sort-options">Sort</label>
    //     <select name="sort-options" id="sort-options" onChange={sortOptionsHandler}>
    //         <option value={"newlyListed"}>Time: Newly Listed</option>
    //         <option value={"endingSoonest"}>Time: Ending Soonest</option>
    //         <option value={"price"}>Price + Postage: Lowest First</option>
    //     </select>

    //     <button onClick={saveConfigState}>Save Search</button>
    // </>
    // )
    return <></>
}

function SideBar(
        {ebaySearchResponse, setEbaySaverState, getEbaySaverState}: 
        { 
            ebaySearchResponse: EbaySearchReturn
            setEbaySaverState: Dispatch<EbaySaverState> 
            getEbaySaverState: () => EbaySaverState
        }
    ) {
    
    const ebaySaverState = getEbaySaverState();
    const newEbaySaverState = new EbaySaverState();

    function setCategory(categoryId: string) {
        newEbaySaverState.data["category_ids"] = categoryId;
        setEbaySaverState(newEbaySaverState)
    }

    function setFilterState(filterArgs: string) {
        newEbaySaverState.data["filter"] = `buyingOptions:{${filterArgs}}`
        setEbaySaverState(newEbaySaverState)
    }

    function setChoiceState(choiceArgs: string) {
        ebaySaverState["data"]["sort"] = choiceArgs as SortField;
    }

    function saveConfigState(){
        newEbaySaverState.saveToConfig();
    }


    const categories = extractCategoryDistributions(ebaySearchResponse)
    const reactCategories = []
    for (const cat of categories) {
        reactCategories.push(
            <Category_button cat={cat} setCategory={setCategory}></Category_button>
        )
    }
    return (
        <div>
            <Filter setFilterState={setFilterState} setChoiceState={setChoiceState} saveConfigState={saveConfigState}/>
            {reactCategories}
        </div>
    )
}


export default function App() {
    let searchParams = URLSearchParamsToJson(useSearchParams())
    const [ebaySaverState, setEbaySaverState]= useState<EbaySaverState>(new EbaySaverState())

    function getEbaySaverState() {
        return ebaySaverState;
    }

    // let ebaySearchResponse = search(ebaySaverState.toJson())

    // useEffect(() => {
    //     console.log(searchParams)
    //     ebaySaverState.saveState(searchParams)
    //     function foo() {
    //         console.log(searchParams)
    //         ebaySearchResponse = search(searchParams);
    //     }
    //     foo()
    //     //Remove to since it only needed to fetch category at startup
    //     delete ebaySaverState.data["fieldgroups"];
    // }, [searchParams])

    // ebaySearchResponse.then((response: EbaySearchReturn) => {
    //     return (
    //         <div>
    //             <SearchBar/>
    //             <SideBar ebaySearchResponse={response} getEbaySaverState={getEbaySaverState} setEbaySaverState={setEbaySaverState} ></SideBar>
    //             <ItemsContainer ebaySearchResponse={response}></ItemsContainer>
    //         </div>
    //     )
    // })

    return <></>
}