'use client'
import React, { ReactElement, ReactNode, useEffect, useState } from "react"
import { SearchBar } from "./components/SearchBar";
import { styled, ThemeProvider } from "styled-components";
import { CSSProp } from 'styled-components'
import { DarkTheme } from "./style/theme";

declare module 'react' {
  interface Attributes {
    css?: CSSProp | undefined
  }
}


export const MainContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme["background"]};
    padding: 3px;
`

export const _CenterContainer = styled.div`
    /* width: 100%;
    height: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
`

const Test = styled.div`
  background-color: red;
`

export default function ClientSideApp({children}: {children?: ReactNode}) {
    return (
      <ThemeProvider theme={DarkTheme}>
        <MainContainer>
          <_CenterContainer>
            <SearchBar></SearchBar>
            {children}
          </_CenterContainer> 
        </MainContainer>
      </ThemeProvider>
    )
}