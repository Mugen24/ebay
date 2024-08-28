"use client"
import { Dispatch, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation";
import { CategoryDistribution, ItemSummary, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes";
import React from "react";
import { search } from "@/app/actions/EbayApiWrapper";
import { SearchBar } from "@/app/components/SearchBar";
import { extractCategoryDistributions, extractItems, URLSearchParamsToJson } from "@/app/actions/utils";
import { EbaySaverState } from "@/app/actions/EbaySaverState";
import styled from "styled-components";
import { EbayItem } from "@/app/components/EbayItem";

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


const StyleItemsContainer = styled.div `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`
export function ItemsContainer({ebaySaverState}: {
    ebaySaverState: EbaySaverState
}) {
    const [ebaySearchResponse, setEbaySearchResponse] = useState<EbaySearchReturn | {}>({})

    useEffect(() => {
        (async () => {
            const resp = await search(ebaySaverState.toJson())
            setEbaySearchResponse(resp)
        })()
    }, [ebaySaverState])

    const ebayItems = [];
    for (const item of extractItems(ebaySearchResponse as EbaySearchReturn)) {
        ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
    }

    return (
        <div>
            <h1>Search: {ebaySaverState.data.q}</h1>
            <StyleItemsContainer>
                {ebayItems}
            </StyleItemsContainer>
        </div>
    )
}


function Filter({setFilterState, setChoiceState, saveConfigState}: {
    setFilterState: (filterArgs: string) => void,
    setChoiceState: (choiceArgs: string) => void,
    saveConfigState: () => void,
}) {
    const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof Element) {
            const params = event.target.nodeValue;
            // ebaySaverState["data"]["filter"] = `buyingOptions:{${params}}`
            setFilterState(params as string)
        }
    }

    const sortOptionsHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void = (event) => {
        // if (event.target instanceof Element) {
        //     const params = event.target.nodeValue;
        //     ebaySaverState["data"]["sort"] = params as SortField;
        // }
        if (event.target instanceof HTMLSelectElement) {
            const choice = event.target.value;
            setChoiceState(choice);
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

        <button onClick={saveConfigState}>Save Search</button>
    </>
    )
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
    newEbaySaverState.saveState(ebaySaverState.toJson())

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
    for (const category of categories) {
        reactCategories.push(
            <Category_button key={category.categoryId} cat={category} setCategory={setCategory}></Category_button>
        )
    }
    return (
        <div>
            <Filter setFilterState={setFilterState} setChoiceState={setChoiceState} saveConfigState={saveConfigState}/>
            {reactCategories}
        </div>
    )
}

export default function AppLoader() {
    const searchParams = useSearchParams()
    const saverState = new EbaySaverState()
    let [data, setData] = useState<EbaySearchReturn>();
    saverState.saveState(URLSearchParamsToJson(searchParams))
    //Remove to since it only needed to fetch category at startup
    delete saverState.data["fieldgroups"];
    useEffect(() => {
        fetch(`/api/search?${searchParams.toString()}`)
        .then((resp) => {
            return resp.json()
        })
        .then((resp: EbaySearchReturn) => {
            setData(resp)
        })
        .catch((e) => {
            console.log(e)
        })

    }, [searchParams])

    if (!data) {
        return <></>
    }
    return <App initialData={data} initialSaverState={saverState}></App>

}

export function App({initialData, initialSaverState}: {
    initialData: EbaySearchReturn,
    initialSaverState: EbaySaverState,
    }) {
    const [ebaySaverState, setEbaySaverState]= useState<EbaySaverState>(initialSaverState)
    // const [ebaySearchReturn, setEbaySearchReturn] = useState<EbaySearchReturn>(initialData)
    useEffect(() => {
        setEbaySaverState(initialSaverState)
    }, [initialSaverState])
    function getEbaySaverState() {
        return ebaySaverState;
    }
    return (
        <div>
            <SearchBar/>
            <SideBar ebaySearchResponse={initialData as EbaySearchReturn} getEbaySaverState={getEbaySaverState} setEbaySaverState={setEbaySaverState} ></SideBar>
            <ItemsContainer ebaySaverState={ebaySaverState}></ItemsContainer>
        </div>
    )
}