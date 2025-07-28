'use client'
import React, { useState } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "@/app/hooks/useQueryState";
import { useAxios } from "@/app/hooks/useAxios";



export function SearchBar() {
    const refSearchForm = useRef<HTMLInputElement>(null);
    const refLink= useRef<HTMLAnchorElement>(null);
    const router = useRouter()
    const {queryState, queryHandler} = useQueryState()

    return (
        <div
            className="
                flex
                gap-1
                w-full
                justify-center
            "
        >
            <input 
                ref={refSearchForm}
                type="search"
                className="
                    w-3/4
                    h-12
                    border-2
                    border-solid
                    rounded-3xl
                    pl-4
                "
                placeholder="search"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        refLink.current?.click()
                    }
                }}
            />
            <button
                ref={refLink}
                href={{
                    pathname: "/items"
                }}
                className="
                    m-auto
                    mx-4
                    text-2xl
                    hover:text-gray-100
                    text-center
                "
                onClick={(e) => {
                    if (refSearchForm.current && refSearchForm.current.value) {
                        queryState["q"] = refSearchForm.current.value
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
            </button>
        </div>
    )
}