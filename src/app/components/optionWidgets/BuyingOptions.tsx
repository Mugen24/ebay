//@ts-nocheck
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { ToggleInput } from "../baseComponents/ToggleInput";
import { useQueryState } from "@/app/hooks/useQueryState";
import logging from "@/app/utils/logger";

export type FilterButtonType = {
}
export function BuyingOptions() {
    const {queryState, queryHandler} = useQueryState()
    const [value, setValue] = useState()

    const OPTION_KEY = "buyingOptions"

    const BuyingOptions = {
        "All": ["AUCTION", "BEST_OFFER", "FIXED_PRICE"],
        "Auction": ["AUCTION"],
        "Buy it now": ["BEST_OFFER", "FIXED_PRICE"]
    }


    function onClick(value: string) {
        logging.debug("buyingOptionHandler: ", value)
        queryHandler({
            type: "updateFilterOption",
            results: {
                key: OPTION_KEY,
                value: BuyingOptions[value]
            }
        })
        
        setValue(value)
    }

    useEffect(() => {
        if (queryState && queryState.filter && queryState.filter[OPTION_KEY]) {
            const searchParamFilter = JSON.stringify(queryState.filter[OPTION_KEY])
            for (const [key, value] of Object.entries(BuyingOptions)) {
                if (JSON.stringify(value) === searchParamFilter) {
                    setValue(key)
                }
            }
        }
    }, [queryState])

    return (
        <ToggleInput 
            type="single"
            options={Object.keys(BuyingOptions).map(k => {
                return {
                    label: k,
                    value: k
                }
            })}
            onClick={onClick}
            value={value}
        />
    )
}


