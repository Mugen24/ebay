'use client'

import { EbaySaverState } from "@/app/actions/EbaySaverState";
import { URLSearchParamsToJson, extractItems } from "@/app/actions/utils";
import { EbayItem } from "@/app/components/EbayItem";
import { ItemGallery } from "@/app/components/ItemGallery";
import { EbaySearchReturn } from "@/app/types/ebaySeachTypes";
import { searchAction } from "@/app/EbayApi/EbayApiAction";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EbayItemSideBar } from './components/EbayItemSidebar';
import { SearchBar } from "@/app/components/SearchBar";
import styles from "./structure.module.css"

export function ClientPage({}: {
    }) {
    const [ebaySaverState, setEbaySaverState]= useState<EbaySaverState>(new EbaySaverState())
    const searchParams = useSearchParams();
    const [ebaySearchResponse, setEbaySearchResponse] = useState<EbaySearchReturn | undefined>(undefined)
    const initialResponse = useRef<EbaySearchReturn>();

    useEffect(() => {
        (async () => {
            const jsonUrlSearchParams = URLSearchParamsToJson(searchParams)
            ebaySaverState.saveState(jsonUrlSearchParams)
            delete ebaySaverState.data["fieldgroups"];
            console.log(jsonUrlSearchParams);
            const data = await searchAction(jsonUrlSearchParams)
            .then((resp: EbaySearchReturn) => {
                console.log(resp);
                initialResponse.current = resp;
                setEbaySearchResponse(resp);
            })
        })()
    }, [])

    function getEbaySaverState() {
        return ebaySaverState;
    }

    return (
        <div>
            <div className={styles.center_content}>
                <SearchBar getEbaySaverState={getEbaySaverState}/>
            </div>

            {initialResponse.current ?
                <EbayItemSideBar ebaySearchResponse={initialResponse.current as EbaySearchReturn} ebaySaverState={ebaySaverState} setEbaySaverState={setEbaySaverState} ></EbayItemSideBar> 
                : <h1>Not yet render</h1>
            }
            <ItemsContainer ebaySearchResponse={ebaySearchResponse} ebaySaverState={ebaySaverState}></ItemsContainer>
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
            <h1>Search: {ebaySaverState.data.q}</h1>
            <ItemGallery ebayItems={ebayItems}/>
        </div>
    )
}
