import React from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { formToJSON } from "axios";
import { EbaySearch } from "../types/ebaySeachTypes";

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
        <form ref={refSearchForm}>
            <input type="text" name="q"></input>
            <input type="button" defaultValue="Enter" onClick={onclick}/>
        </form>
    )
}