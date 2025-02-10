'use client'
import { EbaySaverState } from "../EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./baseComponents/CategoryContainer"
import styles from "./structure.module.css"
import { Filter as FilterType} from "../EbayApi/EbaySaverState"
import { Filter } from "./baseComponents/FilterContainer"
import { useQueryState } from "../hooks/useQuerytState"
import logging from "../utils/logger"
import { SortField } from "../types/EbayApiTypes/ebaySeachTypes"

export function EbayItemSideBar() {
    const {state, setState, resp} = useQueryState()
    logging.info("Sidebar initialise")
    logging.debug(state)

    function setCategory(categoryId: string) {
        logging.info("Set category: ", categoryId)
        state.category_ids = categoryId
        setState(state)
    }

    function setFilterState<T extends keyof FilterType>(filterKey: T, filterValues: FilterType[T]) {
        logging.info("Set filter state: ", filterKey, ":", filterValues)
        for (const value of filterValues) {
            EbaySaverState.addUniqueFilter(state, filterKey, value,  true)
            const newState= {...state}
            setState(newState)
        }
    }

    function setSortState(choiceArgs: SortField) {
        logging.info("Set sort state: ", choiceArgs)
        state.sort = choiceArgs
        setState(state)
    }

    function saveConfigState(){
        EbaySaverState.saveToConfig(state)
    }

    return (
        <div className={styles.side_bar}>
            <Filter setFilterState={setFilterState} setSortState={setSortState} saveConfigState={saveConfigState}/>
            <CategoryContainer setCategory={setCategory}></CategoryContainer>
        </div>
    )
}

