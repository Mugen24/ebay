'use client'
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EbayItemSideBar } from '../../components/EbayItemSidebar';
import { SearchBar } from "@/app/components/baseComponents/SearchBar";
import { useAxios } from "@/app/hooks/useAxios";
import { ItemGallery } from "@/app/components/baseComponents/ItemGallery";
import { useQueryState } from "@/app/hooks/useQueryState";
import { CategoriesList } from "@/app/components/baseComponents/CategoriesList";
import { PreviousButton } from "@/app/components/ebayComponents/PreviousButton";
import { NextButton } from "@/app/components/ebayComponents/NextButton";

export function ClientPage() {
    const { queryState, queryHandler, response, updateResponse } = useQueryState()

    useEffect(() => {
        const url = new URL(window.location.href)
        if (Object.keys(queryState).length) {
            url.searchParams.set("query", JSON.stringify(queryState))

            // !!Prevent same state from being pushed twice!!
            window.history.replaceState({}, "", url)
            updateResponse()
        }

        //TODO: window history check
        return 
    }, [queryState])


    return (
        <div
            className="
                grid
                grid-cols-[300px_1fr_1fr_1fr]
                grid-rows-[fit-content_70px_70fr]
                gap-2
            "
        >
            <div
                className="
                    col-start-1
                    col-span-4
                    row-start-1
                    row-end-2
                "
            >
                <CategoriesList></CategoriesList>
            </div>
            <div 
                className="
                    col-start-2
                    col-span-3
                    row-start-2
                    row-end-3
                "
            >
                <SearchBar/>
            </div>
            <div 
                className="
                    col-span-1
                    col-start-1
                    row-start-3
                "
            >
                <EbayItemSideBar/>
            </div>
            <div 
                className="
                    col-span-3
                    col-start-2
                    row-start-3
                "
            >
                <ItemGallery/>
            </div>

        </div>
    )
}

