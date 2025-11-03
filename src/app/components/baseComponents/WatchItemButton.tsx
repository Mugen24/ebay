"use client";
import { useAxios } from "@/app/hooks/useAxios";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Button } from "@/components/ui/button";
import { CopyMinus, CopyPlus } from "lucide-react";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { LoadingButton } from "../loading/LoadingButton";
import React from "react";
import { EbayItemServerData } from "./EbayItem";


export function WatchItemButton({ebayItem, server}: {
    ebayItem: ItemSummary,
    server?: EbayItemServerData
}) {

    const {getAxios} = useAxios()
    const axios = getAxios()

    const savedID = server ? server.id : null
    const ebayItemNumber = savedID ?? ebayItem.itemId

    const [state, setState] = useState<"Add" | "Remove">(ebayItemNumber ? "Remove" : "Add")

    // async function updateState() {
    //     const resp= await axios.get(`setting/watch/item/${ebayItemNumber}`)
    //     const state = resp.status !== 200 ? "Add" : "Remove"
    //     setState(state)

    // }

    // useEffect(() => {
    // },[])


    function onClick() {
        if (state === "Add") {
            axios.put(`setting/watch/item/${ebayItemNumber}`, JSON.stringify(ebayItem))
            setState("Remove")
        } else {
            axios.delete(`setting/watch/item/${ebayItemNumber}`)
            setState("Add")
        }
        // updateState()
    }
    return (
        <Button 
            variant={"outline"} 
            onClick={onClick}
        >
            {state === "Add" ? <CopyPlus/> : <CopyMinus/>}
            {state}
        </Button>
    )
}
