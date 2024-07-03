"use client"

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { EbaySearch, EbaySearchReturn } from "./types/ebaySeachTypes";
import { formToJSON } from "axios";
import { useRouter } from "next/navigation";
import { PollingQueries } from "./server";
import { ItemsContainer } from "./items/page";
import { clearInterval, setInterval } from "timers";

export function SearchBar({ }: {
}) {

    const refSearchForm = useRef(null);
    const router = useRouter();
    function onclick() {
        if (refSearchForm.current === null) {
            throw new Error("Ref is null")
        }

        const queries: EbaySearch = formToJSON(new FormData(refSearchForm.current))
        queries["fieldgroups"] = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"
        console.log(queries)
        const params = new URLSearchParams(queries as Record<string, any>)
        router.push(`/items` + "?" + params.toString())
    }

    return (
        <form ref={refSearchForm}>
            <input type="text" name="q"></input>
            <input type="button" defaultValue="Enter" onClick={onclick}/>
        </form>
    )
}


function SavedSearchDashboard() {
    const [searches, setSearches]: [EbaySearchReturn[], Dispatch<SetStateAction<EbaySearchReturn[]>>] = useState([] as EbaySearchReturn[]);
    useEffect(() => {
        async function pollSavedSearches() {
            const responses = await PollingQueries();
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