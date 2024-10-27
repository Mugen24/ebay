'use client'

import { URLSearchParamsToJson, extractItems } from "@/app/actions/utils";
import { EbaySaverState } from "@/app/EbayApi/EbaySaverState";
import { EbayItem } from "@/app/components/baseComponents/EbayItem";
import { ItemGallery } from "@/app/components/ItemGallery";
import { EbaySearchReturn } from "@/app/types/ebaySeachTypes";
import { searchAction } from "@/app/EbayApi/EbayApiAction";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EbayItemSideBar } from '../../components/EbayItemSidebar';
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./structure.module.css"

export function ClientSidePage({}: {
}) {
    const searchParams = useSearchParams();
    const [ebaySaverState, setSaverState] = useState<EbaySaverState | undefined>(undefined);
    const [ebaySearchReturn, setSearchReturn] = useState<EbaySearchReturn | undefined>(undefined);

    useEffect(() => {
        (async () =>{
            const jsonUrlSearchParams = URLSearchParamsToJson(searchParams)
            const ebaySaverState = new EbaySaverState(jsonUrlSearchParams);
            ebaySaverState.removeCategoryRequest()

            const data = await searchAction(jsonUrlSearchParams);
            setSaverState(ebaySaverState);
            setSearchReturn(data);
        })()
    }, [])

    return (
        <>
            {
                ebaySaverState ? 
                    ebaySearchReturn ? 
                        <_ClientPage initialSaverState={ebaySaverState} initialResponse={ebaySearchReturn}></_ClientPage>
                        : <></>
                    : <></>
            }
        </>
    )

}

export function _ClientPage({initialSaverState, initialResponse}: {
        initialSaverState: EbaySaverState
        initialResponse: EbaySearchReturn
    }) {
    const [ebaySaverState, setEbaySaverState]= useState<EbaySaverState>(initialSaverState);
    const [ebaySearchResponse, setEbaySearchResponse] = useState<EbaySearchReturn | undefined>(undefined);

    // const ebaySearchResponse = useRef<EbaySearchReturn | undefined>(undefined);

    useEffect(() => {
        // setEbaySearchResponse(initialResponse)
    }, [])

    useEffect(() => {
        (async () => {
            if (ebaySearchResponse === undefined) {
                setEbaySearchResponse(initialResponse)
            } else {
                const data = await searchAction(ebaySaverState.toJSON())
                setEbaySearchResponse(data)
            }
        })()
    }, [ebaySaverState])

    function getEbaySaverState() {
        return ebaySaverState;
    }

    // EbayItemSideBar gets initialResponse 
    // Because it contains information about category
    // Which get stripped in subsequent call

    return (
        <div>
            <div className={styles.center_content}>
                <SearchBar getEbaySaverState={getEbaySaverState}/>
            </div>
            <div className={styles.main_page}>
                <div className={styles.sidebar}>
                    <EbayItemSideBar ebaySearchResponse={initialResponse} ebaySaverState={ebaySaverState} setEbaySaverState={setEbaySaverState} ></EbayItemSideBar> 
                </div>
                <div className={styles.items_container}>
                    <ItemsContainer ebaySearchResponse={ebaySearchResponse} ebaySaverState={ebaySaverState}></ItemsContainer>
                </div>
            </div>
        </div>
    )
}


export function ItemsContainer({ebaySearchResponse, ebaySaverState}: {
    ebaySearchResponse: EbaySearchReturn | undefined
    ebaySaverState: EbaySaverState
}) {

    const ebayItems = [];
    if (ebaySearchResponse) {
        for (const item of extractItems(ebaySearchResponse)) {
            ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
        }
    }

    return (
        <div>
            <h1>Search: {ebaySaverState.q}</h1>
            <ItemGallery ebayItems={ebayItems}/>
        </div>
    )
}
