"use client"
import { MainContainer } from "./style/searchBar";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { EbaySearchReturn } from "./types/ebaySeachTypes";
import { ItemsContainer } from "./(subpages)/items/page";
import { clearInterval, setInterval } from "timers";
import { fetchSavedSearches } from "./actions/fetchSavedSearches";
import { SearchBar } from "./components/SearchBar";

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
        searchedComponents.push(<ItemsContainer key={search.next} ebaySearchResponse={search}/>)
    }
    return (
        <div id="savedSearches">
            {searchedComponents}
        </div>
    )
}


export default function app() {

    return (
        <MainContainer>
            <SearchBar/>
            <SavedSearchDashboard></SavedSearchDashboard>
        </MainContainer>
    )
}