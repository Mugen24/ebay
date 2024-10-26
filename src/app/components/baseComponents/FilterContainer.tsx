import { BuyingOptions, ConditionOptions, EbaySearchReturn, SortField } from "@/app/types/ebaySeachTypes"

export function Filter({setFilterState, setSortState, saveConfigState}: {
    setFilterState: (filterArgs: (BuyingOptions | ConditionOptions)[]) => void,
    setSortState: (choiceArgs: string) => void,
    saveConfigState: () => void,
}) {
    const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof HTMLButtonElement) {
            const params = event.target.value;
            if (params) {
                setFilterState([`buyingOptions:{${params}}` as BuyingOptions])
            }
        }
    }

    const conditionOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof HTMLButtonElement) {
            const params = event.target.value;
            // console.log("option handler")
            // console.log(event)
            if (params) {
                setFilterState([`conditions:{${params}}` as ConditionOptions])
            }
        }
    }

    const sortOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        // if (event.target instanceof Element) {
        //     const params = event.target.nodeValue;
        //     ebaySaverState["data"]["sort"] = params as SortField;
        // }
        if (event.target instanceof  Element) {
            const choice = event.target.nodeValue;
            setSortState(choice as string);
        }
    }


    return (
    <div>
        <section>
            <button className="primary_button" value="FIXED_PRICE|BEST_OFFER|AUCTION" onClick={buyingOptionsHandler}>All</button>
            <button className="primary_button" value="AUCTION" onClick={buyingOptionsHandler}>AUCTION</button>
            <button className="primary_button" value="FIXED_PRICE|BEST_OFFER" onClick={buyingOptionsHandler}>Buy It Now</button>
        </section>

        <section>
            <button className="primary_button" value="NEW" onClick={conditionOptionsHandler}>New</button>
            <button className="primary_button" value="USED" onClick={conditionOptionsHandler}>Used</button>
            <button className="primary_button" value="UNSPECIFIED" onClick={conditionOptionsHandler}>Other</button>
        </section>

        <section>
            <a>Sort: </a>
            <button className="primary_button" value={"newlyListed"} onClick={sortOptionsHandler}>Time: Newly Listed</button>
            <button className="primary_button" value={"endingSoonest"} onClick={sortOptionsHandler}>Time: Ending Soonest</button>
            <button className="primary_button" value={"price"} onClick={sortOptionsHandler}>Price + Postage: Lowest First </button>
        </section>
        <section>
            <a>Save Search:</a>
            <button className="primary_button" onClick={saveConfigState}>Save Search</button>
        </section>
    </div>
    )
}