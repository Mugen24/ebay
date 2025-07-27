'use client'
import { EbaySaverState } from "../server/EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./QueryOptions/CategoryContainer"
import styles from "./structure.module.css"
import { Filter as FilterType} from "../server/EbayApi/EbaySaverState"
import { Filter } from "./QueryOptions/FilterContainer"
import { useQueryState } from "../hooks/useQueryState"
import logging from "../utils/logger"
import { Category, SortField } from "../types/EbayApiTypes/ebaySeachTypes"
import { Categories } from "../server/setting/categoryManager"

export function EbayItemSideBar() {
    const {queryState, queryHandler} = useQueryState()

    function setCategory(categoryId: string) {
        logging.info("Set category: ", categoryId)
        //state.category_ids = categoryId
        //setState({...state})
        
        queryHandler({
            "type": "updateCategory",
            "results": categoryId
        })
    }

    function setFilterState<T extends keyof FilterType>(filterKey: T, filterValues: FilterType[T]) {
        //setState({...state})
        queryHandler({
            "type": "updateFilterOption",
            "results": {
                "key": filterKey,
                "value": filterValues
            }
        })
    }

    function setSortState(choiceArgs: SortField) {
        logging.info("Set sort state: ", choiceArgs)
        // state.sort = choiceArgs
        // setState({...state})
        queryHandler({
            "type": "updateSortOption",
            "results": choiceArgs
        })
    }

    function saveConfigState(){
        // EbaySaverState.saveToConfig(state)
        logging.warn("NOT IMPLEMENTED")
    }


    return (
        <div className={styles.side_bar}>
            <Filter setFilterState={setFilterState} setSortState={setSortState} saveConfigState={saveConfigState}/>
            {/* <CategoryContainer setCategory={setCategory}></CategoryContainer> */}
        </div>
    )
}

