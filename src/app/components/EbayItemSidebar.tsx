'use client'
import { EbaySaverState } from "../EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./baseComponents/CategoryContainer"
import { BuyingOptions, ConditionOptions, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes"
import { Dispatch } from "react"
import styles from "./structure.module.css"
import { Filter } from "../EbayApi/EbaySaverState"

export function EbayItemSideBar(
        {ebaySearchResponse, setEbaySaverState, ebaySaverState}: 
        { 
            ebaySearchResponse: EbaySearchReturn
            setEbaySaverState: Dispatch<EbaySaverState> 
            ebaySaverState: EbaySaverState
        }
    ) {
    
    const newEbaySaverState = new EbaySaverState(ebaySaverState.toJson());

    function setCategory(categoryId: string) {
        newEbaySaverState.category_ids = categoryId;
        setEbaySaverState(newEbaySaverState)
    }

    function setFilterState<T extends keyof Filter>(filterKey: T, filterValue: Filter[T]) {
        newEbaySaverState.addUniqueFilter(filterKey, filterValue)
        console.log("setting saver state")
        console.log(JSON.stringify(newEbaySaverState))
        console.log(JSON.stringify(ebaySaverState))
        setEbaySaverState(newEbaySaverState)
    }

    function setSortState(choiceArgs: string) {
        ebaySaverState["data"]["sort"] = choiceArgs as SortField;
    }

    function saveConfigState(){
        newEbaySaverState.saveToConfig();
    }

    console.log(ebaySearchResponse)
    return (
        <div className={styles.side_bar}>
            <Filter setFilterState={setFilterState} setSortState={setSortState} saveConfigState={saveConfigState}/>
            <CategoryContainer categories={extractCategoryDistributions(ebaySearchResponse)} setCategory={setCategory}></CategoryContainer>
        </div>
    )
}

