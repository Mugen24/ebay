'use client'

import { URLSearchParamsToJson, extractItems } from "@/app/actions/utils";
import { EbaySaverState } from "@/app/EbayApi/EbaySaverState";
import { EbayItem } from "@/app/components/baseComponents/EbayItem";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EbayItemSideBar } from '../../components/EbayItemSidebar';
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./structure.module.css"
import { QueryStateProvider, useQueryState } from "@/app/hooks/useQuerytState";
import { ButtonList } from "@/app/components/baseComponents/ButtonList";
import logging from "@/app/utils/logger";

export function ClientPage() {
    const {
        state,
        resp,
        getNoPage,
        toPage,
    } = useQueryState()



    // Fetching pagination
    const noPage = getNoPage()
    let pageNumbers: number[] = []
    if (noPage) {
        pageNumbers = [...Array(noPage).keys()]
    }

    if (!resp) {
        return <>
            <h1>Loading...</h1>
        </>
    }

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
                    <ItemsContainer/>
                </div>
            </div>
            <div>
                <ButtonList items={pageNumbers} onClick={toPage}></ButtonList>
            </div>
        </div>
    )
}


export function ItemsContainer() {
    const {state, resp} = useQueryState();
    logging.debug("Items Container Update:", state)
    logging.debug("Items Container Update:", resp)
    const ebayItems = [];
    if (resp) {
        for (const item of extractItems(resp)) {
            ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
        }
    }



    return (
        <div>
            <h1>Search: {state.q}</h1>
        </div>
    )
}
