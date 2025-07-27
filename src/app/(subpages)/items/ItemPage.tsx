'use client'

import { URLSearchParamsToJson, extractItems } from "@/app/actions/utils";
import { EbaySaverState } from "@/app/server/EbayApi/EbaySaverState";
import { EbayItem } from "@/app/components/baseComponents/EbayItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EbayItemSideBar } from '../../components/EbayItemSidebar';
import { SearchBar } from "@/app/components/baseComponents/SearchBar";
import styles from "./structure.module.css"
import { QueryStateProvider, useQueryState } from "@/app/hooks/useQueryState";
import { ButtonList } from "@/app/components/baseComponents/ButtonList";
import logging from "@/app/utils/logger";
import { EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { useAxios } from "@/app/hooks/useAxios";

export function ClientPage() {
    const { queryState, queryHandler, response, updateResponse } = useQueryState()
    const { getAxios } = useAxios()
    const axios = getAxios()

    useEffect(() => {
        updateResponse()
    }, [queryState])

    return (
        <div>
            <div className={styles.center_content}>
                <SearchBar/>
            </div>
            <div className={styles.main_page}>
                <div className={styles.sidebar}>
                    <EbayItemSideBar/>
                </div>
                <div className={styles.items_container}>
                    <ItemGallery/>
                </div>
            </div>
        </div>
    )
}


export function ItemGallery() {
    const {queryState, response} = useQueryState();
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
                    grid-cols-4
                "
            >
                {ebayItems}
            </div>
        </>
    )
}
