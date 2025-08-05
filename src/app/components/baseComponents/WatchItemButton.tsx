"use client";
import { useAxios } from "@/app/hooks/useAxios";
import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Button } from "@/components/ui/button";
import { CopyMinus, CopyPlus } from "lucide-react";
import { Suspense, use, useEffect, useRef, useState } from "react";
import { LoadingButton } from "../loading/LoadingButton";
import React from "react";


export function WatchItemButton({ebayItem}: {
    ebayItem: ItemSummary
}) {
    const {getAxios} = useAxios()
    const axios = getAxios()
    const ebayItemNumber = ebayItem.itemId.split("|")[1]
    const [state, setState] = useState<"Loading" | "Add" | "Remove">("Loading")

    async function updateState() {
        const resp= await axios.get(`setting/watch/item/${ebayItemNumber}`)
        const state = resp.status !== 200 ? "Add" : "Remove"
        setState(state)

    }

    useEffect(() => {
        updateState()
    },[])


    function onClick() {
        if (state === "Add") {
            axios.put(`setting/watch/item/${ebayItemNumber}`)
        } else {
            axios.delete(`setting/watch/item/${ebayItemNumber}`)
        }
        updateState()
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