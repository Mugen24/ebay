import styled from "styled-components"
import { ItemSummary } from "../types/ebaySeachTypes"
import { PrefixPathnameNormalizer } from "next/dist/server/future/normalizers/request/prefix"
const StyleEbayItem = styled.div`
    padding: 3px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin: 5px;
    &:hover{
        box-shadow: 0px 0px 10px 1px ${props => props.theme.dark["highlight"]}
    }
`

const StyleImage = styled.image `

`
const StyleHintWord = styled.p`
    color: lightgray;
    font-size: smaller;
`

export function EbayItem({ ebayItem }: { ebayItem: ItemSummary }) {
    return (
        <StyleEbayItem className="ebay-item">
            <img src={ebayItem.image.imageUrl} alt={ebayItem.title}/>
            <a href={ebayItem.itemWebUrl}><p>{ebayItem.title}</p></a>
            {ebayItem.buyingOptions.map(option => <StyleHintWord>{option}</StyleHintWord>)}
            <p>{ebayItem.price.convertedFromCurrency} {ebayItem.price.convertedFromValue}</p>
            <p>{ebayItem.price.currency}: {ebayItem.price.value}</p>
            <p>Conditions: {ebayItem.condition}</p>
            <p>date: {ebayItem.itemCreationDate}</p>
            {/* <p>Shipping</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCostType}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.convertedFromCurrency}:{ebayItem.shippingOptions[0].shippingCost.convertedFromValue}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.currency}:{ebayItem.shippingOptions[0].shippingCost.value}</p> */}
        </StyleEbayItem>
    )
}