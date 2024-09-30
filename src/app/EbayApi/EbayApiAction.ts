// This file is meant server action that talks through an API layer 

import { EbaySearch, EbaySearchReturn } from "../types/ebaySeachTypes";

// instead of directly to a server
export async function searchAction(ebaySearch: EbaySearch): Promise<EbaySearchReturn> {
    const urlSearchParams = new URLSearchParams(ebaySearch as Record<string, string>)
    return fetch("/api/search?" + urlSearchParams.toString(), {method: "GET"})
    .then(data => data.json())
}