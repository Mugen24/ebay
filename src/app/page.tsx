"use client"

import { MutableRefObject, forwardRef, useRef } from "react"
import { EbaySearchReturn } from "./types/ebaySeachTypes";


async function sendSearch(formRef: MutableRefObject<any>) {
    // fetch("http://localhost:3000/api/search")
    console.log(formRef.current)
}


function _SearchBar({ onClick }, ref: any) {
    let searchInputRef = useRef(null);
    function preSearch() {
        if (searchInputRef.current === null) {
            return
        }

        let q = searchInputRef.current.value;
        fetch(`http://localhost:3000/api/ebay/search?q=${q}&limit=3&fieldgroups=CATEGORY_REFINEMENTS`)
        .then(value => {
            return value.json()
        })
        .then(value => {
            let ebaySearchReturn: EbaySearchReturn = value
            console.log(ebaySearchReturn)
        })
        .catch()
    }
    return (
        <form ref={ref}>
            <input ref={searchInputRef} type="text" name="q" onInput={preSearch}></input>
            <input type="button" onClick={onClick} defaultValue="Enter"/>
        </form>
    )
}

const SearchBar = forwardRef(_SearchBar)


export default function main () {
    const style = {
        height: "100px"
    }
    const formRef = useRef(null)

    function getForm() {
        if (formRef.current === null) {
            return
        }

        console.log("hello")
        const queries = new FormData(formRef.current)
        for (let [key, value] of queries.entries()) {
            console.log(key)
            console.log(value)
        }
    }

    return (
        <div style={style}>
            <SearchBar onClick={getForm} ref={formRef}/>
        </div>
    )
}