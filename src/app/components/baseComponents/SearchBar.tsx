'use client'
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "@/app/hooks/useQueryState";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList } from "cmdk";
import { Input } from "@/components/ui/input";
import { EbaySaverState } from "@/app/server/EbayApi/EbaySaverState";
import Link from "next/link";



export function SearchBar() {
    const refSearchForm = useRef<HTMLInputElement>(null);
    const refLink= useRef<HTMLAnchorElement>(null);
    const router = useRouter()
    const {queryState, queryHandler} = useQueryState()
    const [searchQuery, setSearchQuery] = useState(queryState["q"] ?? "")

    return (
        <div
            className="
                justify-center
                h-20
                px-14
                flex
                flex-row
            "
        >
                <Input 
                    className="
                        border-2
                        border-solid
                        rounded-l-3xl
                        pl-4
                        h-full
                        flex-3/4
                    "
                    ref={refSearchForm}
                    type="search"
                    placeholder="search"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            refLink.current?.click()
                        }
                    }}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }}
                        
                />

                <Button 
                    asChild={true}
                    className="
                        h-full
                        flex-auto
                        max-w-40
                        text-2xl
                    "
                >
                    <Link
                        href={"/items"}
                        onNavigate={(e) => {
                            e.preventDefault()
                            if (refSearchForm.current) {
                                if (!refSearchForm.current.value) {
                                    delete queryState["q"]
                                }
                                else {
                                    queryState["q"] = refSearchForm.current.value
                                }

                                EbaySaverState.addCategoryRequest(queryState)
                                queryHandler({
                                    "type": "updateQuery",
                                    "results": refSearchForm.current.value
                                })
                                router.push(`items?query=${JSON.stringify(queryState)}`, )

                            } 
                        }}
                    >
                        Search
                    </Link>
                </Button>

        </div>
    )
}
