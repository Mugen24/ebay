import React from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formToJSON } from "axios";
import { EbaySearch } from "../types/ebaySeachTypes";
import { styled } from "styled-components";

export const SearchBarStyle = styled.div`
    width: 80%;
    height: 5%;
    background-color: gray;
    display: flex;
    align-items: center;
`;

export const SearchForm = styled.form`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background-color: aliceblue;
` 
const InputBarStyle = styled.input`
    flex-grow: 1;
`

const EnterButton = styled.input`
    padding-inline: 5px;
    flex-basis: 10%;
`


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
        <SearchBarStyle>
            <SearchForm ref={refSearchForm}>
                <InputBarStyle type="text" name="q"/>
                <EnterButton type="button" defaultValue="Enter" onClick={onclick}/>
            </SearchForm>
        </SearchBarStyle>
    )
}