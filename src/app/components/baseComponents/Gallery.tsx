import { createContext, ReactNode } from "react";

export function Gallery({children}:
    {
        children: ReactNode
    }
) {
    const GalleryContext = createContext<any>(undefined)
    const value = {
    }

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    )    
}

export function GalleryTitle({children}:
    {children: ReactNode}
) {
    return (
        <>
            {children}
        </>
    )
}

export function GalleryList({children}: {children: ReactNode}) {
    return (
        <>
            <div 
                className="
                    grid
                    grid-cols-[repeat(auto-fill,200px))]
                "
            >
                {children}
            </div>
        </>
    )
}

export function GalleryItem({asChild, name, value, children}:
    {
        asChild?: boolean
        name?: any,
        value?: any
        children?: ReactNode
    }
) {
    return (
        <div>
            {   
            !asChild ?  `${name}: ${value}`
            : children
            }
        </div>
    )
}
