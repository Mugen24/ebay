"use client"
import React, { ReactElement, useEffect, useState } from "react"
import { ItemsContainer } from "./(subpages)/items/page";
import { fetchSavedSearches } from "./actions/fetchSavedSearches";
import { SearchBar } from "./components/SearchBar";
import { EbaySaverState } from "./actions/EbaySaverState";
import { styled, ThemeProvider } from "styled-components";
import { StyledButton } from "./style/button";
import { GlobalStyle } from "./style/globals";
import type { CSSProp } from 'styled-components'
import { getCategories } from "./actions/EbayApiWrapper";


declare module 'react' {
  interface Attributes {
    css?: CSSProp | undefined
  }
}

const StyleSavedSearchDashboard = styled.div `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`

const MainContainer = styled.div`
    max-width: 100%;
    max-height: 100%;
    background-color: ${props => props.theme["background"]};
    display: flex;
    flex-direction: column;
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
        <div>
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
        </div>
    )
}


export const _CenterContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
export default function app() {
    useEffect(() => {
        getCategories(1249)
    })
    return (
        <MainContainer>
            {/* <_CenterContainer><SearchBar/></_CenterContainer>
            <SavedSearchDashboard></SavedSearchDashboard> */}
        </MainContainer>
    )
}