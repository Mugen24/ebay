'use client'
import React, { useState } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryState } from "@/app/hooks/useQueryState";



export function SearchBar() {
    const refSearchForm = useRef<HTMLInputElement>(null);
    const refLink= useRef<HTMLButtonElement>(null);
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
            <Link
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
                onNavigate={(e) => {
                    if (refSearchForm.current && refSearchForm.current.value) {
                        queryHandler({
                            "type": "updateQuery",
                            "results": refSearchForm.current?.value
                        })
                    } else {
                        e.preventDefault()
                    }
                }}
            >
                Search
            </Link>
        </div>
    )
}