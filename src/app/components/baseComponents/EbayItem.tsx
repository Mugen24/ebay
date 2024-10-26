// import styled from "styled-components"
import { ItemSummary } from "../../types/ebaySeachTypes"
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
    return (
        <div className={styles.ebay_item}>
            <img src={ebayItem.image.imageUrl} alt={ebayItem.title}/>
            <div>
                <a href={ebayItem.itemWebUrl}><p>{ebayItem.title}</p></a>
                <div style={{
                    display: "flex"
                }}>{
                    ebayItem.buyingOptions.map(option => <div key={Date.now()} style={{
                        color: "lightgray",
                        fontSize: "xx-small",
                        marginRight: "5px"
                    }}>{option}</div>)
                }</div>
            </div>
            <p>{ebayItem.price.convertedFromCurrency} {ebayItem.price.convertedFromValue}</p>
            <p>{ebayItem.price.currency}: {ebayItem.price.value}</p>
            <p>Conditions: {ebayItem.condition}</p>
            <p>date: {ebayItem.itemCreationDate}</p>
            {/* <p>Shipping</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCostType}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.convertedFromCurrency}:{ebayItem.shippingOptions[0].shippingCost.convertedFromValue}</p>
            <p>{ebayItem.shippingOptions[0]?.shippingCost.currency}:{ebayItem.shippingOptions[0].shippingCost.value}</p> */}
        </div>
    )
}