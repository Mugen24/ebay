import { ReactElement } from "react";
import styles from "./structure.module.css";
import { EbayItem } from "./EbayItem";
import { Favourite, FavouriteQueryData } from "@/app/types/SettingType";
import { EbaySearchReturn } from "@/app/types/EbayApiTypes/ebaySeachTypes";

type FavouriteQueryElementStyle = {
    favourite: Favourite,
    ebaySearchReturn: EbaySearchReturn
}
export function FavouriteQueryElement({favourite, ebaySearchReturn}: FavouriteQueryElementStyle) {
    return (
        <div className={styles.item_gallery}>
        </div>
    )
}
