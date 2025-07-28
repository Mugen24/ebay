import { extractItems } from "@/app/actions/utils";
import { useQueryState } from "@/app/hooks/useQueryState";
import { EbayItem } from "./EbayItem";

export function ItemGallery() {
    const {queryState, response} = useQueryState();
    const ebayItems = [];
    if (response) {
        for (const item of extractItems(response)) {
            ebayItems.push(<EbayItem key={item.itemId} ebayItem={item}/>)
        }
    }

    return (
        <>
            <h1>Search: {queryState.q}</h1>
            <div 
                className="
                    grid
                    grid-cols-5
                "
            >
                {ebayItems}
            </div>
        </>
    )
}