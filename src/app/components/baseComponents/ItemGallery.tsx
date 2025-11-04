'use client';
import { extractItems } from "@/app/actions/utils";
import { useQueryState } from "@/app/hooks/useQueryState";
import { EbayItem } from "./EbayItem";
import logging from "@/app/utils/logger";
import { PreviousButton } from "../ebayComponents/PreviousButton";
import { NextButton } from "../ebayComponents/NextButton";
export function ItemGallery() {
    const {queryState, response} = useQueryState();
    logging.debug(response)
    const ebayItems = [];
    if (response) {
        for (const item of extractItems(response)) {
            ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
        }
    }

    return (
        <>
            <h1>Search: {queryState.q}</h1>
            <div 
                className="
                    grid
                    grid-cols-[repeat(auto-fill,200px))]
                "
            >
                {ebayItems}
            </div>
            <div
                className="flex flex-row justify-start"
            >
                <PreviousButton></PreviousButton>
                <NextButton></NextButton>
            </div>
        </>
    )
}