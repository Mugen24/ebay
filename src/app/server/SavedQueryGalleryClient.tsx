import { ReactElement } from "react";
import { EbaySearch, EbaySearchReturn, ItemSummary } from "../types/EbayApiTypes/ebaySeachTypes";
import { search } from "../EbayApi/EbayApi";
import { EbayItem } from '../components/baseComponents/EbayItem';
import styles from './structure.module.css'
import { ItemGallery } from "../components/ItemGallery";
// import { SearchConfigDataType, getSearchListener } from './SearchListener';

// const searchListener = getSearchListener()

// export async function SavedQueryGallery() {
//     const itemGalleries: ReactElement<typeof ItemGallery>[] = [];
//     const data = await searchListener.oneOffSearch()

//     for (const [term, items] of Object.entries(data)) {
//         const itemComponents: ReactElement<typeof EbayItem>[] = []
//         for (let itemSummary of items) {
//             itemComponents.push(<EbayItem key={`${itemSummary.itemId}:${itemSummary.epid}`} ebayItem={itemSummary}/>);
//         }

//         //TODO: change to a better key
//         // maybe hash the items?
//         itemGalleries.push(<ItemGallery key={`P:${term}`} ebayItems={itemComponents}/>);
//     }
//     return (
//         <div className={styles.save_search_dashboard}>
//             {itemGalleries}
//         </div>
//     )
// }


