"use client"
import React from "react";
import { ClientPage } from "./ItemPage";
import { QueryStateProvider } from '../../hooks/useQuerytState';

export default function App() {
    return (
        <QueryStateProvider>
            <ClientPage></ClientPage>
        </QueryStateProvider>
    )
}
