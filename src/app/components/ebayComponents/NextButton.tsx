import { useAxios } from "@/app/hooks/useAxios";
import { useQueryState } from "@/app/hooks/useQueryState";
import { Button } from "@/components/ui/button";
import { ChevronLastIcon } from "lucide-react";
export function NextButton() {
    const {queryState, response, queryHandler} = useQueryState()

    function onClick() {
        const offset = Number(response?.limit)
        const limit = Number(response?.offset)
        const nextOffset = offset + limit

        queryHandler({
            "type": "updateOffset",
            "results": nextOffset
        })

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        })

    }
    return (
        <Button onClick={onClick} size={"lg"}>
            <ChevronLastIcon></ChevronLastIcon>
        </Button>
    )
}
