'use client'
import { EbaySaverState } from "../EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./baseComponents/CategoryContainer"
import { BuyingOptions, ConditionOptions, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes"
import { Dispatch } from "react"
import styles from "./structure.module.css"
import { Filter as FilterType} from "../EbayApi/EbaySaverState"
import { Filter } from "./baseComponents/FilterContainer"

export function EbayItemSideBar(
        {ebaySearchResponse, setEbaySaverState, ebaySaverState}: 
        { 
            ebaySearchResponse: EbaySearchReturn
            setEbaySaverState: Dispatch<EbaySaverState> 
            ebaySaverState: EbaySaverState
        }
    ) {
    
    const newEbaySaverState = new EbaySaverState(ebaySaverState.toJSON());
    console.log("sidebar:")
    console.log(newEbaySaverState)

    function setCategory(categoryId: string) {
        newEbaySaverState.category_ids = categoryId;
        setEbaySaverState(newEbaySaverState)
    }

    function setFilterState<T extends keyof FilterType>(filterKey: T, filterValues: FilterType[T]) {
        newEbaySaverState.addUniqueFilters(filterKey, filterValues, true)
        console.log("setting saver state")
        console.log(JSON.stringify(newEbaySaverState))
        console.log(JSON.stringify(ebaySaverState))
        setEbaySaverState(newEbaySaverState)
    }

    function setSortState(choiceArgs: SortField) {
        ebaySaverState.sort = choiceArgs;
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

