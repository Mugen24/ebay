import { Countries, Filter as FilterType } from "@/app/server/EbayApi/EbaySaverState";
import { useQueryState } from "@/app/hooks/useQueryState";
import { ConditionOption, SortField } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import logging from "@/app/utils/logger";
import React, { useEffect, useState } from "react";
import { useStateManager } from "@/app/hooks/useStateManagement";
import { useAxios } from "@/app/hooks/useAxios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleInput } from "../baseComponents/ToggleInput";
import { WatchQueryButton } from "../baseComponents/WatchQueryButton";

export function Filter() {
    const {queryState, queryHandler} = useQueryState();
    const {userData} = useStateManager()
    const setting = userData.setting
    const {getAxios} = useAxios()


    // TODO: move all this login into EbaySaverState
    function buyingOptionsHandler(option: string)  {
        logging.debug("buyingOptionHandler: ", option)
        const key = "buyingOptions"
        let value = undefined
        switch (option.toLowerCase()) {
            case "all": 
                value = ["AUCTION", "BEST_OFFER", "FIXED_PRICE"]
                queryHandler({
                    type: "updateFilterOption",
                    results: {
                        key,
                        value
                    }
                })
            break;
            case "auction": 
                value = ["AUCTION"]
                queryHandler({
                    type: "updateFilterOption",
                    results: {key, value}
                })
            break;
            case "buy it now": 
                // setFilterState("buyingOptions", ["BEST_OFFER", "FIXED_PRICE"])
                value = ["BEST_OFFER", "FIXED_PRICE"]
                queryHandler({
                    type: "updateFilterOption",
                    results: {key, value}
                })
            break;
        }

    }

    function conditionOptionsHandler(newState: string) {
            const key =  "conditions"

            // setFilterState("conditions", [param as ConditionOption])
            const value = newState as ConditionOption
            queryHandler({
                type: "updateFilterOption",
                results: {key, value}
            })
    }

    function sortOptionsHandler(newState: string)  {
            // setSortState(choice as SortField);
            queryHandler({
                type: "updateSortOption",
                results: newState as SortField
            })
    }

    function locationOptionsHandler(country: keyof typeof Countries){
        // setItemLocation(event.target?.value)
        queryHandler({
            "type": "updateItemLocation",
            "results": {
                "country": country
            }
        })
    }

    const countryOptions = Object.keys(Countries)
    const postcodeOption = 2100
    const [country, setCountry] = useState<string>(countryOptions[0])
    const [postcode, setPostcode] = useState(postcodeOption)

    async function updateAddress(country: string, postcode: number) {
        await axios.put("/setting/setAddress", JSON.stringify({
            country,
            postcode
        })
    )}

    function handleCountry(country: string) {
        (async () => {
            await updateAddress(country, postcode)
            setCountry(country)
        })()
    }

    function handlePostcode(postcode: number) {
        (async () => {
            await updateAddress(country, postcode)
            setPostcode(postcode)
        })()
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
                <CardContent>
                    <div>
                        <ToggleInput
                            type="single"
                            options={[
                                {
                                    label: "All",
                                    value: "all",
                                },
                                {
                                    label: "Auction",
                                    value: "auction",
                                },
                                {
                                    label: "Buy It Now",
                                    value: "buy it now",
                                },
                            ]}  
                            onClick={buyingOptionsHandler}
                        />
                    </div>
                    <div>
                        <CardDescription>Conditions</CardDescription>
                        <ToggleInput
                            type="multiple"
                            options={[
                                {
                                    label: "New",
                                    value: "NEW"
                                },
                                {
                                    label: "Used",
                                    value: "USED"
                                },
                                {
                                    label: "Unspecified",
                                    value: "UNSPECIFIED"
                                },
                            ]}
                            onClick={conditionOptionsHandler}
                        />
                    </div>
                    <div>
                        <CardDescription>Date</CardDescription>
                        <ToggleInput
                            options={[
                                {
                                    label: "New",
                                    value: "newlyListed"
                                },
                                {
                                    label: "Ending Soon",
                                    value: "endingSoonest"
                                },
                                {
                                    label: "Lowest",
                                    value: "price",
                                }
                            ]}  
                            type="single"
                            onClick={sortOptionsHandler}
                        >

                        </ToggleInput>
                    </div>
                </CardContent>
                <CardFooter>
                    <WatchQueryButton></WatchQueryButton>
                </CardFooter>
        </Card>
    )
}
