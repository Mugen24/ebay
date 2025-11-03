import { useAxios } from "@/app/hooks/useAxios";
import { ReactNode, useEffect, useState } from "react";
import { EbayItem } from "../baseComponents/EbayItem";
import { EbaySearch, ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { SSEProvider, useSSE } from "@/app/hooks/useSSE";
import { Gallery, GalleryItem, GalleryList, GalleryTitle } from "../baseComponents/Gallery";
import { HyperText } from "../baseComponents/HyperText";
import { GetCategorySubtreeResponse } from "@/app/types/EbayApiTypes/CategoryTree";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isDeepStrictEqual } from "node:util";

function WatchedCategory({id, query} : {id: string, query: any}) {
    const {data} = useSSE()
    const [updatedContent, setUpdatedContent] = useState<undefined | ItemSummary[]>(undefined)
    const {getAxios} = useAxios()
    const axios = getAxios()
    const [isDeleted, setIsDeleted] = useState(false)

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
            setIsDeleted(true)
        }
    }


    const extraData = JSON.stringify({
        queryID: id
    })

    const [title, setTitle] = useState(query["q"])

    useEffect(() => {
        (async () => {
            if (!query["q"] && query["category_ids"]) {
                const resp = await axios.get(`categories/getSubCategories/${query["category_ids"]}`)
                const data: GetCategorySubtreeResponse = JSON.parse(resp.data)
                setTitle(data.categorySubtreeNode.category.categoryName)
            }
        })()
    }, [query["category_ids"]])

    if (isDeleted) {
        return <></>
    }

    return (
        <Gallery>
            <GalleryTitle>
                <HyperText 
                    title={title} 
                    href={`items?query=${JSON.stringify(query)}&extraData=${extraData}`}
                />
                <Button
                    className="inline"
                    onClick={deleteCategory}
                    variant="ghost"
                >
                    <Trash/>
                </Button>
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

    const [cats, setCats] = useState<ReactNode[]>([])
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
