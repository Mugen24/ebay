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
import CategoryContainer from "@/app/components/EbayCategoryContainer";
import { StyledButton, StyleOption } from "@/app/style/inputWidgets";

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


function Filter({setFilterState, setSortState, saveConfigState}: {
    setFilterState: (filterArgs: string) => void,
    setSortState: (choiceArgs: string) => void,
    saveConfigState: () => void,
}) {
    const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof Element) {
            const params = event.target.nodeValue;
            // ebaySaverState["data"]["filter"] = `buyingOptions:{${params}}`
            setFilterState(params as string)
        }
    }

    const sortOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        // if (event.target instanceof Element) {
        //     const params = event.target.nodeValue;
        //     ebaySaverState["data"]["sort"] = params as SortField;
        // }
        if (event.target instanceof  Element) {
            const choice = event.target.nodeValue;
            setSortState(choice as string);
        }
    }


    return (
    <div>
        <section>
            <StyledButton value="FIXED_PRICE|BEST_OFFER|AUCTION" onClick={buyingOptionsHandler}>All</StyledButton>
            <StyledButton value="AUCTION" onClick={buyingOptionsHandler}>AUCTION</StyledButton>
            <StyledButton value="FIXED_PRICE|BEST_OFFER" onClick={buyingOptionsHandler}>Buy It Now</StyledButton>
        </section>

        <section>
            <StyledButton></StyledButton>
        </section>

        <section>
            <a>Sort: </a>
            {/* <select style={{}} name="sort-options" id="sort-options" onChange={sortOptionsHandler}>
                <StyleOption value={"newlyListed"}>Time: Newly Listed</StyleOption>
                <StyleOption value={"endingSoonest"}>Time: Ending Soonest</StyleOption>
                <StyleOption value={"price"}>Price + Postage: Lowest First </StyleOption>
            </select> */}
            <StyledButton value={"newlyListed"} onClick={sortOptionsHandler}>Time: Newly Listed</StyledButton>
            <StyledButton value={"endingSoonest"} onClick={sortOptionsHandler}>Time: Ending Soonest</StyledButton>
            <StyledButton value={"price"} onClick={sortOptionsHandler}>Price + Postage: Lowest First </StyledButton>
        </section>
        <section>
            <a>Save Search:</a>
            <StyledButton onClick={saveConfigState}>Save Search</StyledButton>
        </section>
    </div>
    )
}

const StyleSideBar = styled.div`
    overflow: scroll;
    display: flex;
    flex-direction: column;
    gap: 5px;
    height: 97dvh;
`
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

    function setSortState(choiceArgs: string) {
        ebaySaverState["data"]["sort"] = choiceArgs as SortField;
    }

    function saveConfigState(){
        newEbaySaverState.saveToConfig();
    }

    return (
        <StyleSideBar>
            <Filter setFilterState={setFilterState} setSortState={setSortState} saveConfigState={saveConfigState}/>
            <CategoryContainer categories={extractCategoryDistributions(ebaySearchResponse)} setCategory={setCategory}></CategoryContainer>
        </StyleSideBar>
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

const StyleEbayItemsContainer= styled.div`
    display: flex;
`
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
            <div style={{display: "flex", justifyContent: "center"}}>
                <SearchBar getEbaySaverState={getEbaySaverState}/>
            </div>
            <StyleEbayItemsContainer>
                <SideBar ebaySearchResponse={initialData as EbaySearchReturn} getEbaySaverState={getEbaySaverState} setEbaySaverState={setEbaySaverState} ></SideBar>
                <ItemsContainer ebaySaverState={ebaySaverState}></ItemsContainer>
            </StyleEbayItemsContainer>
        </div>
    )
}