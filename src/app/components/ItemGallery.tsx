import { ReactElement } from "react";
import styles from "./structure.module.css";
import { EbayItem } from "./baseComponents/EbayItem";

export function ItemGallery({ebayItems}: {ebayItems: ReactElement<typeof EbayItem>[]}) {
    return (
        <div className={styles.item_gallery}>
            {ebayItems}
        </div>
    )
}