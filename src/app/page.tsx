"use client"

import { MutableRefObject, ReactHTMLElement, SetStateAction, forwardRef, useEffect, useRef, useState } from "react"
import { Category, CategoryDistribution, EbaySearch, EbaySearchReturn, ItemSummary} from "./types/ebaySeachTypes";
import axios, { Axios, AxiosInstance } from "axios";
import { baseAxios } from "./EbayAxios";
import { formToJSON } from "axios";
import { Ebay } from "./api/ebay/ebay";
import { EbayItem } from "./EbayItem";

function _SearchBar({ onClick }: {onClick: () => void }, ref: any) {
    let searchInputRef = useRef(null);
    return (
        <form ref={ref}>
            <div id="Category"></div>
            <input ref={searchInputRef} type="text" name="q"></input>
            <input type="button" onClick={onClick} defaultValue="Enter"/>
        </form>
    )
}

const SearchBar = forwardRef(_SearchBar)

function SideBar(
        { ebayAxios, searchUrl, getCategories, setEbayItems}: 
        { 
            ebayAxios: MutableRefObject<Axios>,
            searchUrl: MutableRefObject<string>,
            getCategories: () => CategoryDistribution[],
            setEbayItems: (rawReponse: EbaySearchReturn) => void
        }
    ) {

    function refineCategoryItemCall(categories_id: string) {
        return () => {
            ebayAxios.current.get(searchUrl.current + `&categories_id=${categories_id}`)
            .then((value) => setEbayItems(JSON.parse(value.data)))
        }
    }

    const reactCategories = []
    if (getCategories !== undefined) {
        const categories = getCategories();
        for (const cat of categories) {
            reactCategories.push(
                <div><a key={cat.categoryId} onClick={refineCategoryItemCall(cat.categoryId)}>{cat.categoryName}</a></div>
            )
        }
    }
    return (
        <div>
            {reactCategories}
        </div>
    )
}


export default function main () {
    const style = {
        height: "100px"
    }
    const formRef = useRef(null)
    const refAxios: MutableRefObject<Axios> = useRef(new Axios(baseAxios))
    const refOldSearchUrl: MutableRefObject<string> = useRef("")
    const [ ebayItems, _setEbayItems ]: [ EbayItem[] | undefined, any] = useState()
    const [ categories, _setCategories ]  = useState([])

    function setEbayItems(rawReponse: EbaySearchReturn) {
        const itemSummaries = rawReponse.itemSummaries;
        console.log(rawReponse)
        _setEbayItems(itemSummaries.map(value => EbayItem.fromItemSummary(value)))
    }


    function getCategories() {
        return categories as CategoryDistribution[]
    }

    function getForm() {
        const searchOptionals: EbaySearch = {
            fieldgroups: "CATEGORY_REFINEMENTS,ASPECT_REFINEMENTS"
        }


        if (formRef.current === null) {
            return
        }

        const queries = formToJSON(new FormData(formRef.current))
        const searchQueries = new URLSearchParams(Object.assign({}, queries, searchOptionals))


        refOldSearchUrl.current = `/api/ebay/search?${searchQueries.toString()}`
        refAxios.current.get(refOldSearchUrl.current)
        .then((value) => {
            const ebaySearchReturn: EbaySearchReturn = JSON.parse(value.data);
            _setCategories(ebaySearchReturn.refinement.categoryDistributions)
        })
    }

    return (
        <div style={style}>
            <SearchBar onClick={getForm} ref={formRef}/>
            <SideBar setEbayItems={setEbayItems} ebayAxios={refAxios} getCategories={getCategories} searchUrl={refOldSearchUrl}></SideBar>
        </div>
    )
}