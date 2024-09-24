import { readFileSync } from "fs";
import { ReactElement } from "react";
import styled from "styled-components";
import searchConfig from "@/app/data/searchConfig.json"
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/ebaySeachTypes";
import { search } from "../EbayApi/EbayApi";
import { EbayItem } from '../components/EbayItem';

// const StyleSavedSearchDashboard = styled.div `
//     display: grid;
//     grid-template-columns: repeat(3, 1fr);
// `


// const StyleItemGallery = styled.div`

// `

function ItemGallery({ebayItems}: {ebayItems: ReactElement<typeof EbayItem>[]}) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            {ebayItems}
        </div>
    )
}

export async function SavedSearchDashboard() {
    const searchParams = searchConfig.searchParams
    let key: keyof typeof searchParams
    const itemGalleries: ReactElement<typeof ItemGallery>[] = [];

    for (key in searchParams) {
        const searchParam: EbaySearch = searchParams[key] as EbaySearch;
        const ebaySearchReturn: EbaySearchReturn = await search(searchParam);
        const itemComponents: ReactElement<typeof EbayItem>[] = []

        const itemSummaries: ItemSummary[] = ebaySearchReturn.itemSummaries;
        for (let itemSummary of itemSummaries) {
            itemComponents.push(<EbayItem ebayItem={itemSummary}/>)
        }

        itemGalleries.push(<ItemGallery ebayItems={itemComponents}/>)
    }
    return (
        <div>
            {itemGalleries}
        </div>
    )
}


