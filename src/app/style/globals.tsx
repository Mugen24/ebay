"use client"
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        font-size: medium;
        border: none;
        color: ${props => props.theme["text-color"]}
    }
    html, body {
        max-width: 100vw;
        height: 100vh; 
        margin: 0;
        padding: 0px;
        background-color: ${props => props.theme["background"]};
    }
`