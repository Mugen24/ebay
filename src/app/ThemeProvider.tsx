'use client'
import React, { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { DarkTheme } from "./style/theme";

export function ColorProvider({children, theme}: {children: ReactNode, theme: any}) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}