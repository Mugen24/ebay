//@ts-nocheck
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { ToggleInput } from "../baseComponents/ToggleInput";
import { useQueryState } from "@/app/hooks/useQueryState";
import logging from "@/app/utils/logger";

export type FilterButtonType = {
}
export function DateOptions() {
    const {queryState, queryHandler} = useQueryState()
    const [value, setValue] = useState()

    const OPTION_KEY = "updateSortOption"

    const DateOptions = {
        "New": "newlyListed",
        "Ending Soon": "endingSoonest",
        "Lowest": "price",
    }

    function onClick(value: string) {
        logging.debug("DateOptionHandler: ", value)

        queryHandler({
            type: OPTION_KEY,
            results: DateOptions[value]
        })
        
        setValue(value)
    }

    useEffect(() => {
        if (queryState && queryState.sort) {
            for (const [key, value] of Object.entries(DateOptions)) {
                if (value === queryState.sort) {
                    setValue(key)
                }
            }
        }
    }, [queryState])

    return (
        <ToggleInput 
            type="single"
            options={Object.keys(DateOptions).map(k => {
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


