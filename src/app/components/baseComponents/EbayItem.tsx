"use client";
// import styled from "styled-components"
import logging from '@/app/utils/logger';
import { ItemSummary, CurrentBidPrice, ShippingOption } from '../../types/EbayApiTypes/ebaySeachTypes';
import Image from 'next/image';
import { Timer } from './Timer';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WatchItemButton } from './WatchItemButton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { LoadingButton } from '../loading/LoadingButton';
import React, { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";


export function EbayItem({ ebayItem }: { ebayItem: ItemSummary }) {
    const itemTypes = ebayItem.buyingOptions

    // OPTIONS = FIXED_PRICE BEST_OFFER AUCTION
    const bidCount = ebayItem.bidCount;
    const currentBidPrice = ebayItem.currentBidPrice?.value;
    const currentBidPriceCurrency = ebayItem.currentBidPrice?.currency;
    const originalBidCurrency = ebayItem.currentBidPrice?.convertedFromCurrency;
    const originalBidCurrencyPrice = ebayItem.currentBidPrice?.convertedFromValue;

    const originalCurrency = ebayItem.price?.convertedFromCurrency;
    const originalCurrencyPrice = ebayItem.price?.convertedFromValue
    const price = ebayItem.price?.value
    const currency= ebayItem.price?.currency

    const condition = ebayItem.condition

    const location = ebayItem.itemLocation.country
    const postcode= ebayItem.itemLocation.postalCode

    const shippingObject= ebayItem.shippingOptions ?? []
    const shippingPrice = shippingObject[0]?.shippingCost.value
    const shippingCurrency= shippingObject[0]?.shippingCost.currency

    const ebayItemNumber = ebayItem.itemId.split("|")[1]

    const createDate = new Date(ebayItem.itemCreationDate)
    const endDate = new Date(ebayItem.itemEndDate)
    console.log(ebayItem)

    return (
        <Card
            className='
                grid
                grid-rows-[30px_auto_20px]
                w-[200px]
                h-[410px]
            '
        >
            <CardHeader>
                <CardTitle>
                    <Link 
                        href={ebayItem.itemWebUrl}
                        className='hover:underline'
                    >
                        
                        {ebayItem.title}
                    </Link>
                </CardTitle> 
            </CardHeader>
            <CardContent 
                className='
                    grid
                    grid-rows-[min-content_150px_100px]
                    gap-2
                '
            >
                <div
                    className='row-start-1 row-span-1'
                >
                    <Badge  variant={condition === "Used" ? "destructive" : "default"}>{condition}</Badge>
                    <CardDescription>
                        Ebay item number: {ebayItemNumber}
                    </CardDescription>
                </div>
                {
                    ebayItem.image?.imageUrl ? 
                        <Image 
                            width={300}
                            height={300} 
                            src={ebayItem.image?.imageUrl ?? null}
                            alt={ebayItem.title}
                            className='h-[100%]'
                        /> :
                        <div></div>
                }
                <div
                    className='
                        row-start-3
                        overflow-scroll
                    '
                >
                    <div style={{
                        display: "flex"
                    }}>{
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
                    }</div>
                    <p>Location: {location}</p>
                    <p>{originalCurrency} {originalCurrencyPrice}</p>
                    <p>{currency}: {price}</p>
                    <p>date: {new Date(ebayItem.itemCreationDate).toLocaleDateString()}</p>
                    <p>Auction: {originalBidCurrency} {originalBidCurrencyPrice}</p>
                    <p>         {currentBidPriceCurrency} {currentBidPrice}</p>

                    <p>Shipping</p>
                    <p>Price: {shippingPrice} {shippingCurrency}</p>
                    {<Timer startDate={createDate} endDate={endDate}></Timer>}
                </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
                <ErrorBoundary fallback={<h1>fetch has failed</h1>}>
                        <WatchItemButton ebayItem={ebayItem}></WatchItemButton>
                </ErrorBoundary>
            </CardFooter>
        </Card>
    )
}
