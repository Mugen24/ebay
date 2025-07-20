"use client"
import React from "react";
import { ClientPage } from "./ItemPage";
import { QueryStateProvider } from '../../hooks/useQuerytState';
import { SettingProvider } from "@/app/hooks/useStateManagement";

export default function App() {
    return (
        <SettingProvider>
            <QueryStateProvider>
                <ClientPage></ClientPage>
            </QueryStateProvider>
        </SettingProvider>
    )
}
