"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { EbaySearch, EbaySearchReturn } from "./types/ebaySeachTypes";
import { formToJSON } from "axios";
import { useRouter } from "next/navigation";
import { ItemsContainer } from "../../(subpages)/items/page";
import { clearInterval, setInterval } from "timers";
import { fetchSavedSearches } from "./actions/fetchSavedSearches";

function SavedSearchDashboard() {
    const [searches, setSearches]: [EbaySearchReturn[], Dispatch<SetStateAction<EbaySearchReturn[]>>] = useState([] as EbaySearchReturn[]);
    useEffect(() => {
        async function pollSavedSearches() {
            const responses = await fetchSavedSearches();
            setSearches(responses);
        }
        pollSavedSearches();
        const interval = setInterval(pollSavedSearches, 5 * 60 * 100)
        return clearInterval(interval)
    }, [])

    const searchedComponents = []
    for (const search of searches) {
        searchedComponents.push(<ItemsContainer key={search.next} getSearchResponse={search}/>)
    }
    return (
        <div id="savedSearches">
            {searchedComponents}
        </div>
    )
}


export default function app() {
    const style = {
        height: "100px"
    }

    return (
        <div style={style}>
            <SearchBar/>
            <SavedSearchDashboard></SavedSearchDashboard>
        </div>
    )
}