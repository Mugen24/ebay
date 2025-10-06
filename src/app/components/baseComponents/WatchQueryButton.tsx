import { useAxios } from "@/app/hooks/useAxios"
import { useQueryState } from "@/app/hooks/useQueryState"
import { Button } from "@/components/ui/button"
import { CopyMinus, CopyPlus, PlusIcon } from "lucide-react"
import { use, useEffect, useState } from "react"

export function WatchQueryButton() {
    const {queryState, extraData} = useQueryState()
    const {getAxios} = useAxios()
    const axios = getAxios()
    const [queryID, setQueryID] = useState<string | undefined>(undefined)

    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (!queryID) {
            axios.post("setting/watch/query", JSON.stringify({
                query: queryState
            })).then((resp) => {
                const data = JSON.parse(resp.data)
                setQueryID(data["ID"])
            })
        } else {
            axios.delete(`setting/watch/query/${queryID}`)
            .then((resp) => {
                setQueryID(undefined)
            })
        }
    }

    useEffect(() => {
        if (extraData?.queryID) {
            setQueryID(extraData.queryID)
        }
    }, [extraData])

    return (
        <Button onClick={onClick} variant={!queryID ? "default" : "destructive"}>
            {queryID ? 
                <CopyMinus></CopyMinus> 
                :
                <CopyPlus></CopyPlus>
            }
        </Button>
    )
}
