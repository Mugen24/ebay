import { Ebay } from "./api/ebay/ebay";

async function foo() {
    const ebay = await Ebay.initialise();
    const data = await ebay.search({
        q: "drone"
    })
    console.log(data.itemSummaries[0].title)


}

export default function main () {
    foo();
    return (
        <div>

        </div>
    )
}