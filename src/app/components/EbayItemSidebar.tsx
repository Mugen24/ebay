'use client'
import { EbaySaverState } from "@/app/actions/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./baseComponents/CategoryContainer"
import { BuyingOptions, ConditionOptions, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes"
import { Dispatch } from "react"
import styles from "./structure.module.css"

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

    function setFilterState(filterArgs: (BuyingOptions | ConditionOptions)[]) {
        if (!newEbaySaverState.filter) {
            newEbaySaverState.filter = `${filterArgs.join()}`
        } else {
            newEbaySaverState.data["filter"] += `,${filterArgs.join()}`
        }
        console.log("setting saver state")
        console.log(JSON.stringify(newEbaySaverState.data))
        console.log(JSON.stringify(ebaySaverState.data))
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

