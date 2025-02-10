'use client'
import React, { useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formToJSON } from "axios";
import { EbaySearch } from "../types/EbayApiTypes/ebaySeachTypes";
import { styled } from "styled-components";
import { EbaySaverState, SEbaySearch } from "../EbayApi/EbaySaverState";

export const SearchBarStyle = styled.div`
    width: 80%;
    height: 50px;
    background-color: ${props => props.theme["light-blue"]};
    display: flex;
    align-items: center;
`;

export const SearchForm = styled.form`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    gap: 1px;
` 
const InputBarStyle = styled.input`
    flex-grow: 1;
    background-color: ${props => props.theme["write-input"]};
    filter: brightness(90%);
    &:focus {
        outline: none;
        border: 3px solid ${props => props.theme["highlight"]};
    }
    &:hover {
        filter: brightness(100%);
    }
    border: 3px solid ${props => props.theme["foreground"]};
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
`

const EnterButton = styled.input`
    padding-inline: 5px;
    flex-basis: 10%;
    background-color: ${props => props.theme["press-input"]};
    max-width: 100px;
    &:hover {
        opacity: 0.7;
    }

    border-top-right-radius: 10pxh;
    border-bottom-right-radius: 10px;
`


export function SearchBar() {
    const refSearchForm = useRef<HTMLFormElement>(null);
    const [state, setState] = useState<SEbaySearch>()
    const router = useRouter();

    const onclick = () => {
        if (refSearchForm.current) {
            console.log("click")
            const queries: EbaySearch = formToJSON(new FormData(refSearchForm.current)) 
            const params = EbaySaverState.toSearchParams(queries)
            console.log(params)
            window.location.href = `/items` + "?" + params.toString();
        } else {
            if (state) {
                const params = EbaySaverState.toSearchParams(state)
                window.location.href = `/items` + "?" + params.toString();
            }
        }
    }


    return (
        <SearchBarStyle>
            <SearchForm ref={refSearchForm}>
                <InputBarStyle type="text" name="q"/>
                <EnterButton type="button" defaultValue="Enter" onClick={onclick}/>
            </SearchForm>
        </SearchBarStyle>
    )
}