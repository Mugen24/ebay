import React from 'react';
export function ButtonList({
    items,
    onClick}: {
        items: number[],
        onClick: (number: number) => void
    }) 
    {
        const numberComponents = []
        for (const item of items) {
            numberComponents.push(
                <button key={item} onClick={() => onClick(item)}>{item}</button>
            )
        }
        return (
            <>
                {numberComponents}
            </>
        )

    }

