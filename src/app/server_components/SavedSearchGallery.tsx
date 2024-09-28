import { ReactElement } from "react";
import searchConfig from "@/app/data/searchConfig.json"
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/ebaySeachTypes";
import { search } from "../EbayApi/EbayApi";
import { EbayItem } from '../components/EbayItem';
import styles from './structure.module.css'
import { ItemGallery } from "../components/ItemGallery";



export async function SavedSearchDashboard() {
    const searchParams = searchConfig.searchParams
    let key: keyof typeof searchParams
    const itemGalleries: ReactElement<typeof ItemGallery>[] = [];

    let index = 0;
    for (key in searchParams) {
        const searchParam: EbaySearch = searchParams[key] as EbaySearch;
        const ebaySearchReturn: EbaySearchReturn = await search(searchParam);
        const itemComponents: ReactElement<typeof EbayItem>[] = []

        const itemSummaries: ItemSummary[] = ebaySearchReturn.itemSummaries;
        for (let itemSummary of itemSummaries) {
            itemComponents.push(<EbayItem key={`${itemSummary.itemId}:${itemSummary.epid}`} ebayItem={itemSummary}/>);
        }

        itemGalleries.push(<ItemGallery key={`P:${index}`} ebayItems={itemComponents}/>);
        index++;
    }
    return (
        <div className={styles.save_search_dashboard}>
            {itemGalleries}
        </div>
    )
}


