// import styled from "styled-components"
import logging from '@/app/utils/logger';
import { ItemSummary, CurrentBidPrice, ShippingOption } from '../../types/EbayApiTypes/ebaySeachTypes';
import Image from 'next/image';
import styles from "./structure.module.css"
import { Timer } from './Timer';
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

    return (
        <div className={styles.ebay_item}>
            <p>Ebay item number: {ebayItemNumber}</p>
            {
                ebayItem.image?.imageUrl ? 
                    <Image 
                        width={400} 
                        height={400} 
                        src={ebayItem.image?.imageUrl ?? null}
                        alt={ebayItem.title}
                    /> :
                    <></>
            }
            <div>
                <a href={ebayItem.itemWebUrl}><p>{ebayItem.title}</p></a>
                <div style={{
                    display: "flex"
                }}>{
                    ebayItem.buyingOptions.map((option) => <div key={`${ebayItem.epid}_${option}_${ebayItem.itemId}`} style={{
                        color: "lightgray",
                        fontSize: "xx-small",
                        marginRight: "5px"
                    }}>{option}</div>)
                }</div>
            </div>
            <p>Location: {location}</p>
            <p>{originalCurrency} {originalCurrencyPrice}</p>
            <p>{currency}: {price}</p>
            <p>Conditions: {condition}</p>
            <p>date: {new Date(ebayItem.itemCreationDate).toLocaleDateString()}</p>
            <p>Auction: {originalBidCurrency} {originalBidCurrencyPrice}</p>
            <p>         {currentBidPriceCurrency} {currentBidPrice}</p>

            <p>Shipping</p>
            <p>Price: {shippingPrice} {shippingCurrency}</p>
            {<Timer startDate={createDate} endDate={endDate}></Timer>}
        </div>
    )
}
