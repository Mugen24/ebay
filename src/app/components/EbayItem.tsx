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
        box-shadow: ${props => props.theme.dark["highlight"]};
    }
`

const StyleImage = styled.image `

`

export function EbayItem({ ebayItem }: { ebayItem: ItemSummary }) {
    return (
        <StyleEbayItem className="ebay-item">
            <img src={ebayItem.image.imageUrl} alt={ebayItem.title}/>
            <a href={ebayItem.itemWebUrl}><p>{ebayItem.title}</p></a>
            <p>{ebayItem.buyingOptions}</p>
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