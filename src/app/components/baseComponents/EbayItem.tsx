"use client";
// import styled from "styled-components"
import logging from '@/app/utils/logger';
import { ItemSummary, CurrentBidPrice, ShippingOption, EbaySearch } from '../../types/EbayApiTypes/ebaySeachTypes';
import Image from 'next/image';
import { TimerComponent } from './Timer';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WatchItemButton } from './WatchItemButton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import React, { ReactNode, Suspense } from 'react';
import { CategoriesList, CategoryType } from './CategoriesList';


export type EbayItemServerData = {
    id: string,
    data: EbaySearch
}

export type EbayItemType = {
    ebayItem: ItemSummary,
    children?: ReactNode,
    server?: EbayItemServerData 
}

export function EbayItem({ ebayItem, children }: EbayItemType) {
    // console.log(ebayItem)

    const itemTypes = ebayItem.buyingOptions

    // OPTIONS = FIXED_PRICE BEST_OFFER AUCTION
    const bidCount = ebayItem.bidCount;
    const currentBidPrice = ebayItem.currentBidPrice?.value;
    const currentBidPriceCurrency = ebayItem.currentBidPrice?.currency;
    const originalBidCurrency = ebayItem.currentBidPrice?.convertedFromCurrency;
    const originalBidCurrencyPrice = ebayItem.currentBidPrice?.convertedFromValue;

    const originalCurrency = ebayItem.price?.convertedFromCurrency;
    const originalCurrencyPrice = ebayItem.price?.convertedFromValue

    let price = ebayItem.price?.value
    let currency= ebayItem.price?.currency
    if (ebayItem["buyingOptions"].includes("AUCTION")) {
        price = ebayItem.currentBidPrice.value
        currency = ebayItem.currentBidPrice.currency
    }

    const condition = ebayItem.condition

    const location = ebayItem.itemLocation.country
    const postcode= ebayItem.itemLocation.postalCode

    const shippingObject= ebayItem.shippingOptions ?? []
    const shippingPrice = shippingObject[0]?.shippingCost.value
    const shippingCurrency= shippingObject[0]?.shippingCost.currency

    const ebayItemNumber = ebayItem.itemId.split("|")[1]

    const createDate = new Date(ebayItem.itemCreationDate)
    const endDate = new Date(ebayItem.itemEndDate)

    
    const categories: CategoryType[] = []
    for (const cat of ebayItem.categories) {
        categories.push({
            categoryName: cat.categoryName,
            categoryID: cat.categoryId
        })
    }


    // text-[clamp(m,20%,20%)]

    return (
        <Card
            className='
                p-2
                gap-0
                align-top
                grid
                w-[175px]
                h-[300px]
                grid-rows-[30px_minmax(0,1fr)_30px]
                rounded-xl
                border
                shadow-sm
                overflow-hidden
            '
        >
            <CardHeader
                className='
                    overflow-ellipsis
                    text-[80%]
                    justify-items-start
                    items-center
                    h-full
                '
            >
                <CardTitle
                    className='
                    '
                >
                    <Link 
                        href={ebayItem.itemWebUrl}
                        target='_blank'
                        className='
                            w-[133px]
                            block
                            truncate
                            hover:underline
                            text-xs
                            font-semibold
                        '
                    >
                        {ebayItem.title}
                    </Link>
                </CardTitle> 
            </CardHeader>
            <CardContent 
                className='
                    p-0
                    flex
                    flex-col
                '
            >
                <div>
                    <CategoriesList 
                        className="
                            max-w-[100%]
                            overflow-x-scroll
                            p-0
                        " 
                        override={{
                        staticCategories: categories
                        }}
                    />
                    <div>

                        <Badge  variant={condition === "Used" ? "destructive" : "default"}>{condition}</Badge>
                    </div>
                    <div
                        className='
                            flex
                            my-2
                        '     
                    >
                        {
                            ebayItem.buyingOptions.map((option) => {
                                option = option.replace("_", " ").toLowerCase()
                                option = `${option[0].toUpperCase()}${option.slice(1,)}`
                                return (
                                    <Badge 
                                        key={`${ebayItem.epid}_${option}_${ebayItem.itemId}`} 
                                        variant={"destructive"}
                                    >
                                        {option}
                                    </Badge>
                                )
                            })
                        }
                    </div>
                    <CardDescription>
                        EIN: {ebayItemNumber} 
                    </CardDescription>
                    <CardDescription
                        className='text-[0.5rem]'
                    >
                        <p>Location: {location}</p>
                        <p>Date: {createDate.toLocaleString()}</p>
                        <p>{ebayItem.buyingOptions.includes("AUCTION") ? `End date: ${endDate.toLocaleString()}` : ""}</p>
                        {
                            ebayItem.buyingOptions.includes("AUCTION") 
                                ?  <TimerComponent startDate={createDate} endDate={endDate}/> 
                                : ""
                        }
                    </CardDescription>
                </div>

                <div
                    className='
                        relative
                        h-20
                        grow-2
                    ' 
                >
                    {
                        ebayItem.image?.imageUrl ? 
                            <Image 
                                src={ebayItem.image?.imageUrl ?? null}
                                alt={ebayItem.title}
                                fill={true}
                                objectFit='contain'
                                className='h-2/3 w-auto'
                            /> :
                            <div></div>
                    }
                </div>
                <div
                    className='text-[76%]'
                >
                    {
                        /*
                        <p>{originalCurrency} {originalCurrencyPrice}</p>
                        <p>Auction: {originalBidCurrency} {originalBidCurrencyPrice}</p>
                        <p>         {currentBidPriceCurrency} {currentBidPrice}</p>

                        <p>Shipping</p>
                        <p>Price: {shippingPrice} {shippingCurrency}</p>
                        {<Timer startDate={createDate} endDate={endDate}></Timer>}
                        */
                    }
                </div>
            </CardContent>
            <CardFooter className='flex flex-row justify-between px-0'>
                <Badge
                    variant="default"
                    className='h-2/3'
                >
                    {currency}: {price}
                </Badge>
                <WatchItemButton ebayItem={ebayItem}></WatchItemButton>
                {children}
            </CardFooter>
        </Card>
    )
}
