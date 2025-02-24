'use client'
import { EbaySaverState } from "../EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import CategoryContainer from "./QueryOptions/CategoryContainer"
import styles from "./structure.module.css"
import { Filter as FilterType} from "../EbayApi/EbaySaverState"
import { Filter } from "./QueryOptions/FilterContainer"
import { useQueryState } from "../hooks/useQuerytState"
import logging from "../utils/logger"
import { Category, SortField } from "../types/EbayApiTypes/ebaySeachTypes"
import { Categories } from "../server/setting/categoryManager"

export function EbayItemSideBar() {
    const {state, stateDispatch, resp} = useQueryState()
    logging.info("Sidebar initialise")
    logging.debug(state)

    function setCategory(categoryId: string) {
        logging.info("Set category: ", categoryId)
        //state.category_ids = categoryId
        //setState({...state})
        
        stateDispatch({
            "type": "updateCategory",
            "results": categoryId
        })
    }

    function setFilterState<T extends keyof FilterType>(filterKey: T, filterValues: FilterType[T]) {
        //setState({...state})
        stateDispatch({
            "type": "updateFilterState",
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
        stateDispatch({
            "type": "updateSortState",
            "results": choiceArgs
        })
    }

    function saveConfigState(){
        EbaySaverState.saveToConfig(state)
    }

    const categories = resp.refinement?.categoryDistributions ?? [] as Category[]

    return (
        <div className={styles.side_bar}>
            <Filter setFilterState={setFilterState} setSortState={setSortState} saveConfigState={saveConfigState}/>
            <CategoryContainer categories={categories} setCategory={setCategory}></CategoryContainer>
        </div>
    )
}

