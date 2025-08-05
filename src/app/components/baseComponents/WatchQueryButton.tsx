import { useAxios } from "@/app/hooks/useAxios"
import { useQueryState } from "@/app/hooks/useQueryState"
import { Button } from "@/components/ui/button"
import { CopyMinus, CopyPlus, PlusIcon } from "lucide-react"
import { use, useState } from "react"

export function WatchQueryButton() {
    const {queryState} = useQueryState()
    const {getAxios} = useAxios()
    const axios = getAxios()
    const [queryID, setQueryID] = useState<string | undefined>(undefined)

    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        axios.post("setting/watch/query", {
            query: queryState
        }).then((resp) => {
            setQueryID(resp.data.id)
        })
    }

    return (
        <Button onClick={onClick}>
            {queryID ? 
                <CopyMinus></CopyMinus> 
                :
                <CopyPlus></CopyPlus>
            }
        </Button>
    )
}