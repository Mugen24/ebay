"use client"

import { MutableRefObject, useRef, useState } from "react"
import { EbaySearch } from "./types/ebaySeachTypes";
import { formToJSON } from "axios";
import { useRouter } from "next/navigation";

export function SearchBar({ formRef, onclick }: {
    onclick: () => void
    formRef: MutableRefObject<HTMLFormElement | null>
}) {

    return (
        <form ref={formRef}>
            <input type="text" name="q"></input>
            <input type="button" onClick={onclick} defaultValue="Enter"/>
        </form>
    )
}



export default function main () {
    const style = {
        height: "100px"
    }

    const refSearchForm: MutableRefObject<HTMLFormElement| null> = useRef(null)
    const itemRouter = useRouter()



    function onclick() {
        if (refSearchForm.current === null) {
            throw new Error("Ref is null")
        }

        const queries: EbaySearch = formToJSON(new FormData(refSearchForm.current))
        queries["fieldgroups"] = "ASPECT_REFINEMENTS,CATEGORY_REFINEMENTS,MATCHING_ITEMS"
        console.log(queries)
        const params = new URLSearchParams(queries as Record<string, any>)
        itemRouter.push(`/items` + "?" + params.toString())
    }

    return (
        <div style={style}>
            <SearchBar formRef={refSearchForm} onclick={onclick}/>
        </div>
    )
}