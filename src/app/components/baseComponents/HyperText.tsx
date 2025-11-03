import { useQueryState } from "@/app/hooks/useQueryState"
import { ArrowRight, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export type HyperTextType = {
    title: string
    href: string
    onClick?: () => void
}

export function HyperText({title, href, onClick}: HyperTextType) {
    const {queryState, queryHandler} = useQueryState()
    const url = new URLSearchParams(href)

    return (
        <a
            href={href}
            className="
                text-3xl
                underline
                decoration-red-800
                hover:decoration-blue-800
                w-fit
                inline-block
            "
            //prefetch={false}
            // onNavigate={(e) => {
            //     console.log(e)
            //     // queryHandler({
            //     //     "type": "replaceFromSearchParams",
            //     //     "results": url
            //     // })
            // }}
        >
            <h1
                className="w-fit"
            >
                {title}
            </h1> 

        </a>
    )
}
