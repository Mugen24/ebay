import { useQueryState } from "@/app/hooks/useQueryState";
import { Button } from "@/components/ui/button";
import { ChevronFirstIcon, ChevronLastIcon } from "lucide-react";
export function PreviousButton() {
    const {queryState, response, queryHandler} = useQueryState()

    const offset = Number(response?.offset)
    const limit = Number(response?.limit)
    const prevOffset = offset - limit


    function onClick() {
        queryHandler({
            "type": "updateOffset",
            "results": prevOffset
        })
        window.scrollTo({
            top: 0,
            left: 0, 
            behavior: "instant"
        })
    }


    return (
        <Button 
            className={prevOffset < 0 ? "invisible" : "visible"}
            onClick={onClick}
            size={"lg"}>
            <ChevronFirstIcon></ChevronFirstIcon>
        </Button>
    )
}
