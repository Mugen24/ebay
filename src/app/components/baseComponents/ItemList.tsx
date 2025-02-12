import React from 'react';
function ItemList({
    items,
    onClick}: {
        items: [string],
        onClick: (item: string) => void
    }) 
    {
        const itemComponents = []
        for (const item of items) {
            itemComponents.push(
                <a key={item} onClick={() => onClick(item)}>{item}</a>
            )
        }
        return (
            <>
                {itemComponents}
            </>
        )

    }
