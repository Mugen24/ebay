import React from "react";
import logging from "@/app/utils/logger";
import { ebayApi } from "@/app/server/EbayApi/EbayApi";
import { EbaySaverState } from '../../server/EbayApi/EbaySaverState';
import { QueryStateProvider } from "@/app/hooks/useQuerytState";
import { ClientPage } from "./ItemPage";

export default async function App({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const [outcome, results] = await ebayApi.search(EbaySaverState.parse(await searchParams))
    console.assert(outcome)

    const serverData = {
        itemData: results
    }

    return (
        <QueryStateProvider serverData={serverData}>
            <ClientPage></ClientPage>
        </QueryStateProvider>
    )
}
