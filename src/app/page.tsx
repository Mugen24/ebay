"use client"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { EbaySearchReturn } from "./types/ebaySeachTypes";
import { ItemsContainer } from "./(subpages)/items/page";
import { clearInterval, setInterval } from "timers";
import { fetchSavedSearches } from "./actions/fetchSavedSearches";
import { SearchBar } from "./components/SearchBar";
import { EbaySaverState } from "./actions/EbaySaverState";
import { wrap } from "module";
import { styled } from "styled-components";

const StyleSavedSearchDashboard = styled.div `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 60px
`

const MainContainer = styled.div`
    padding: 10px;
    width: 100vw;
    height: 100%;
`

function SavedSearchDashboard() {
    const [searches, setSearches] = useState<EbaySaverState[]>([]);
    //TODO: This timer state is solely used to re-render the component every x seconds
    const [timer, setTimer] = useState("whatever");


    useEffect(() => {
        fetchSavedSearches()
        .then((savedArgs) => {
            const ebaySaverStates : EbaySaverState[] = [];
            for (const search of savedArgs) {
                const ebaySaverState = new EbaySaverState()
                ebaySaverState.saveState(search)
                ebaySaverStates.push(ebaySaverState)
            }
            setSearches(ebaySaverStates);
        })
    }, [])

    const searchedComponents = [];
    let queries: Record<string, any> = {};
    let keyCounter = 0
    const itemRef = useRef([])
    for (const search of searches) {
        queries[search.data.q ?? "Data does not exists"] = keyCounter
        searchedComponents.push(<ItemsContainer key={keyCounter++} ebaySaverState={search}/>)
    }
    return (
        <>
            <div>
                <button>All</button>
                {
                    [Object.keys(queries).map((key) => {
                        <button>{key}</button>
                    })]
                }
            </div>
            <StyleSavedSearchDashboard id="savedSearches">
                {searchedComponents}
            </StyleSavedSearchDashboard>
        </>
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