'use client'
import { EbaySaverState } from "../server/EbayApi/EbaySaverState"
import { extractCategoryDistributions } from "@/app/actions/utils"
import { Filter as FilterType} from "../server/EbayApi/EbaySaverState"
import { Filter } from "./QueryOptions/FilterContainer"
import { useQueryState } from "../hooks/useQueryState"
import logging from "../utils/logger"
import { Category, SortField } from "../types/EbayApiTypes/ebaySeachTypes"
import { Categories } from "../server/setting/categoryManager"

export function EbayItemSideBar() {
    const {queryState, queryHandler} = useQueryState()

    function saveConfigState(){
        // EbaySaverState.saveToConfig(state)
        logging.warn("NOT IMPLEMENTED")
    }


    return (
        <div>
            <Filter/>
        </div>
    )
}

