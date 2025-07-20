import { Countries, EbaySaverState, Filter as FilterType } from "@/app/server/EbayApi/EbaySaverState";
import { useQueryState } from "@/app/hooks/useQuerytState";
import { ConditionOption, SortField } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";
import React, { useEffect } from "react";
import { formToJson } from '../../actions/utils';
import { useSetting } from "@/app/hooks/useStateManagement";

export function Filter({setFilterState, setSortState, saveConfigState}: {
    setFilterState: <T extends keyof FilterType>(filterKey: T, filterValue: FilterType[T]) => void,
    setSortState: (choiceArgs: SortField) => void,
    saveConfigState: () => void,
}) {
    
    const {state, stateDispatch} = useQueryState();
    const settingOb = useSetting()
    const userLocationCountryMap = Object.keys(Countries)
    const setting = settingOb.setting?.current

    // TODO: move all this login into EbaySaverState
    const buyingOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        logging.debug("buyingOptionHandler: ", event)
        const option: string = event.target.value;
        switch (option.toLowerCase()) {
            case "all": 
                setFilterState("buyingOptions", ["AUCTION", "BEST_OFFER", "FIXED_PRICE"])
            break;
            case "auction": 
                setFilterState("buyingOptions", ["AUCTION"])
            break;
            case "buy it now": 
                setFilterState("buyingOptions", ["BEST_OFFER", "FIXED_PRICE"])
            break;
            default:
                console.error("Buying option did not match", option)
        }

    }

    const conditionOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof HTMLButtonElement) {
            const param = event.target.value;
            setFilterState("conditions", [param as ConditionOption])
        }
    }

    const sortOptionsHandler: (event: React.MouseEvent<HTMLButtonElement>) => void = (event) => {
        if (event.target instanceof HTMLButtonElement) {
            const choice = event.target.value;
            setSortState(choice as SortField);
        }
    }

    const locationOptionsHandler: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
        if (event.target?.value) {
            // setItemLocation(event.target?.value)
            stateDispatch({
                "type": "updateItemLocation",
                "results": {
                    "country": event.target?.value
                }
            })
        }
    }

    const addressHandler: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const country = formData.get("country")
        const postcode= formData.get("postcode")
        console.log(formToJson(formData))
        if (country && postcode) {
            stateDispatch({
                "type": "updateUserAddress",
                "results": {
                    "country": country as keyof typeof Countries,
                    "postcode": Number(postcode)
                }
            })
            // setAddress(country as keyof typeof Countries, Number(postcode))
        }
    }

    return (
    <div>
        {
            setting ? 
            <>
                <section>
                    <h1>Delivery Location: </h1>
                    <form onSubmit={addressHandler}>
                        <label htmlFor="Country">Country</label>
                        <select name="country" id="country">
                            {Object.keys(Countries).map((c) => {
                                if (c === setting.shippingLocation) {
                                    return <option selected={true} key={c} value={Countries[c]}>{c}</option>
                                } else {
                                    return <option key={c} value={Countries[c as keyof typeof Countries]}>{c}</option>
                                }
                            })}
                        </select>

                        <label htmlFor="Postcode">Postcode</label>
                        <input type="text" id="Postcode" name="postcode" defaultValue={setting.shippingPostcode}/>

                        <input type="submit" value={"enter"}/>
                    </form>
                </section>
                <section>
                    <form onChange={locationOptionsHandler}>
                        {
                            Object.keys(Countries).map(country => {
                                return (
                                    <div key={`${country}_container`}>
                                        <label key={`${country}_label`} htmlFor={country} >{country}</label>
                                        <input type="radio" checked={country === setting.itemLocation} key={country} id={country} name="country" value={country}/>
                                    </div>
                                )
                            })
                        }
                    </form>
                </section>
            </>
            : <></>
        }

        <section>
            <button className="primary_button" value="All" onClick={buyingOptionsHandler}>All</button>
            <button className="primary_button" value="Auction" onClick={buyingOptionsHandler}>AUCTION</button>
            <button className="primary_button" value="Buy it now" onClick={buyingOptionsHandler}>Buy It Now</button>
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
