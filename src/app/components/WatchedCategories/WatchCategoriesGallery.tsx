import { useAxios } from "@/app/hooks/useAxios";
import { ReactNode, useEffect, useState } from "react";
import { EbayItem } from "../baseComponents/EbayItem";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { SSEProvider, useSSE } from "@/app/hooks/useSSE";
import { Gallery, GalleryItem, GalleryList, GalleryTitle } from "../baseComponents/Gallery";
import { HyperText } from "../baseComponents/HyperText";

function WatchedCategory({id, query} : {id: string, query: any}) {
    const {data} = useSSE()
    const [updatedContent, setUpdatedContent] = useState<undefined | ItemSummary[]>(undefined)
    const {getAxios} = useAxios()
    const axios = getAxios()

    useEffect(() => {
        if (data && data["id"]) {
            console.log("data:", data["id"])
        } else {
            console.log("no data")
        }

        
        if (data && data["id"] == id) {
            setUpdatedContent(data["items"].slice(0, 10))
        }
    }, [data])

    const entries = []

    if (updatedContent){
        // Display only new items
        for (const item of updatedContent) {
            entries.push(
                <GalleryItem asChild={true} key={item["itemId"]}>
                     <EbayItem ebayItem={item}></EbayItem>
                </GalleryItem>
            )
        }
    }

    async function deleteCategory() {
        const resp = await axios.delete(`setting/watch/query/${id}`)
        if (resp.status === 200) {
        }
    }


    const extraData = JSON.stringify({
        queryID: id
    })

    return (
        <Gallery>
            <GalleryTitle>
                <HyperText title={query["q"] ?? query["category_ids"]} href={`
                    items?query=${JSON.stringify(query)}&extraData=${extraData}`}/>
            </GalleryTitle>
            <GalleryList>
                {entries}
            </GalleryList>
        </Gallery>
    )
}


function WatchedCategoriesGallery() {
    const {getAxios} = useAxios()
    const axios = getAxios()

    const [cats, setCats] = useState([])
    useEffect(() => {
        (async () => {
            const resp = await axios.get("setting/watch/query")
            const data = typeof(resp.data) == "string" ? JSON.parse(resp.data) : resp.data
            const newCats = []

            for (const query of data["data"]) {
                const ebaySearch = JSON.parse(query.ebaySearch)
                newCats.push(
                <WatchedCategory 
                            key={query.id} 
                            id={query.id}
                            query={ebaySearch}
                          />
                )
            }

            setCats(newCats)
        })()
    }, [])

    return (
        <div>
            {cats}
        </div>
    )
}

export function WatchedCategoriesRoot() {
    const QueryStreamEndPoint  = "server/api/setting/watch/stream"

    return (
        <SSEProvider endpoint={QueryStreamEndPoint}>
            <WatchedCategoriesGallery/>
        </SSEProvider>
    )
}
