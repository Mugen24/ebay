'use client'
import React, { useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "@/app/hooks/useQueryState";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList } from "cmdk";
import { Input } from "@/components/ui/input";
import { EbaySaverState } from "@/app/server/EbayApi/EbaySaverState";



export function SearchBar() {
    const refSearchForm = useRef<HTMLInputElement>(null);
    const refLink= useRef<HTMLAnchorElement>(null);
    const router = useRouter()
    const {queryState, queryHandler} = useQueryState()

    return (
        <div
            className="
                grid
                justify-center
                h-12
                grid-cols-[2fr_max-content]
                px-4
            "
        >
            <Command
                className="
                    col-start-1
                    col-span-1
                "
            >
                <CommandInput asChild
                    className="
                        border-2
                        border-solid
                        rounded-l-3xl
                        pl-4
                        h-full
                    "
                >
                    <Input 
                        ref={refSearchForm}
                        type="search"
                        placeholder="search"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                refLink.current?.click()
                            }
                        }}
                    />
                </CommandInput>
            </Command>
            <Button
                ref={refLink}
                href={{
                    pathname: "/items"
                }}
                className="
                    col-start-3
                    text-2xl
                    text-center
                    rounded-r-3xl
                    h-full
                "
                onClick={(e) => {
                    if (refSearchForm.current && refSearchForm.current.value) {
                        queryState["q"] = refSearchForm.current.value
                        EbaySaverState.addCategoryRequest(queryState)

                        router.push(`items?query=${JSON.stringify(queryState)}`, )
                        queryHandler({
                            "type": "updateQuery",
                            "results": refSearchForm.current.value
                        })

                    } else {
                        e.preventDefault()
                    }
                }}
            >
                Search
            </Button>
        </div>
    )
}
