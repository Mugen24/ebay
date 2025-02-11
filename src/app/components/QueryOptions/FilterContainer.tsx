import { Countries, EbaySaverState, Filter as FilterType } from "@/app/EbayApi/EbaySaverState";
import { useQueryState } from "@/app/hooks/useQuerytState";
import { ConditionOption, SortField } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";
import React from "react";
import { formToJson } from '../../actions/utils';

export function Filter({setFilterState, setSortState, saveConfigState}: {
    setFilterState: <T extends keyof FilterType>(filterKey: T, filterValue: FilterType[T]) => void,
    setSortState: (choiceArgs: SortField) => void,
    saveConfigState: () => void,
}) {
    
    const {state, setState, setAddress} = useQueryState();
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
            EbaySaverState.setLocation(state, event.target?.value)
        }
        setState({...state})
    }

    const addressHandler: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const country = formData.get("country")
        const postcode= formData.get("postcode")
        console.log(formToJson(formData))
        if (country && postcode) {
            setAddress(country as keyof typeof Countries, Number(postcode))
        }
    }

    return (
    <div>
        <section>
            <h1>Delivery Location: </h1>
            <form onSubmit={addressHandler}>
                <label htmlFor="Country">Country</label>
                <select name="country" id="country">
                    <option value="US">United State</option>
                    <option value="AU">Australia</option>
                </select>

                <label htmlFor="Postcode">Postcode</label>
                <input type="text" id="Postcode" name="postcode" defaultValue="0000"/>

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
                                <input type="radio" key={country} id={country} name="country" value={country}/>
                            </div>
                        )
                    })
                }
            </form>
        </section>

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
