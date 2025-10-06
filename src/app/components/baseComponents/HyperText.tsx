import { ArrowRight, ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export type HyperTextType = {
    title: string
    href: string
    onClick?: () => void
}
export function HyperText({title, href, onClick}: HyperTextType) {
    
    return (
        <Link href={href} className="
                text-3xl
                underline
                decoration-red-800
                hover:decoration-blue-800
        ">
            <h1 >
                {title}
            </h1> 

        </Link>
    )
}
