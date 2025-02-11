// import styled from "styled-components"
import logging from '@/app/utils/logger';
import { ItemSummary, CurrentBidPrice, ShippingOption } from '../../types/EbayApiTypes/ebaySeachTypes';
import styles from "./structure.module.css"
// const StyleEbayItem = styled.div`
//     padding: 3px;
//     display: flex;
//     flex-direction: column;
//     margin: 5px;
//     &:hover{
//         box-shadow: 0px 0px 10px 1px ${props => props.theme["highlight"]}
//     }

//     & > *, * > * {
//         margin: 0;
//         font-size: 0.6vw;
//     }
//     gap: 5px;
// `

// const StyleImage = styled.image `

// `
// const StyleHintWordContainer = styled.div`
//     display: flex;
// `
// const StyleHintWord = styled.p`
//     color: lightgray;
//     font-size: xx-small;
//     margin-right: 5px;
// `



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

    const epid = ebayItem.epid

    return (
        <div className={styles.ebay_item}>
            <p>Epid: {epid}</p>
            <img src={ebayItem.image?.imageUrl} alt={ebayItem.title}/>
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
            <p>date: {ebayItem.itemCreationDate}</p>
            <p>Auction: {originalBidCurrency} {originalBidCurrencyPrice}</p>
            <p>         {currentBidPriceCurrency} {currentBidPrice}</p>

            <p>Shipping</p>
            <p>Price: {shippingPrice} {shippingCurrency}</p>
        </div>
    )
}
