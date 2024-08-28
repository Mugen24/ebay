"use client"
import React, { ReactElement, useEffect, useState } from "react"
import { ItemsContainer } from "./(subpages)/items/page";
import { fetchSavedSearches } from "./actions/fetchSavedSearches";
import { SearchBar } from "./components/SearchBar";
import { EbaySaverState } from "./actions/EbaySaverState";
import { styled, ThemeProvider } from "styled-components";
import { StyledButton } from "./style/button";
import { Themer } from "./style/theme";

const StyleSavedSearchDashboard = styled.div `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 60px
`

const MainContainer = styled.div`
    padding: 10px;
    width: 100vw;
    height: 100%;
    background-color: ${props => props.theme.dark["background"]};
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

    const [displaySearch, _setDisplaySearch] = useState<number>(-1)
    const searchedComponents = [];
    const buttonSearchComponents: ReactElement<HTMLButtonElement>[] = [
        <StyledButton $theme="gray" onClick={()=>setDisplaySearch(-1)} key={-1}>All</StyledButton>
    ];
    function setDisplaySearch(numer: number) {
        console.log(numer)
        _setDisplaySearch(numer)
    }

    let keyCounter = 0
    for (const search of searches) {
        const tempCounter = keyCounter
        buttonSearchComponents.push(
            <StyledButton $theme="gray" onClick={()=> setDisplaySearch(tempCounter)} key={tempCounter}>{search.data.q}</StyledButton>
        )
        searchedComponents.push(<ItemsContainer key={tempCounter} ebaySaverState={search}/>)
        keyCounter++;
    }

    return (
        <>
            <div>
                {buttonSearchComponents}
            </div>
            <StyleSavedSearchDashboard id="savedSearches">
                {
                    displaySearch != -1 ? 
                        searchedComponents[displaySearch]
                        : searchedComponents
                }
            </StyleSavedSearchDashboard>
        </>
    )
}


export default function app() {

    return (
        <ThemeProvider theme={Themer}>
            <MainContainer>
                <SearchBar/>
                <SavedSearchDashboard></SavedSearchDashboard>
            </MainContainer>
        </ThemeProvider>
    )
}