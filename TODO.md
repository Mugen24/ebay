- add: saved query
- add: category + setting caching into cookie
- add: location selector
- useStateManagement: write appropriate dep for each function


- Factorising
- Styling
- Fix debugging statement, it's all over the place
- TODO: move the reduce function out into a separate function 

- Cache catogory id for item
    - Add condition for when to reload category again
    - When clicking a item category disappear


- Save intermediary state for quicker history navigation

- Item entry card could be nicer
- Change this number perpage into a next and previous system
- Fetch general category in main page

- Scrape pagination for dynamic loading, the resp.total is unreliable and not recommend by ebay
- to check if last page. check if offset = current offset

- Allow item location option (partial only AU and US)
- Frontpage save searches should re-fetch ebay api every x seconds
- Extract set category and filter in its own function,

- Search lowest price for the searched item
- take category from the main item to the lowest price search
- UI: most probably be a right sidebar
- Have user manually picked the sold item
and save it for subsequent search as a suggestion
. But still give them the full search.

- Automated reminder when new item is listed
- Bid sniping
- Cleaner prompt when asking for manual ebay login. EbayScraper
- auction doesn't work
- listing doesn't show auction items

BUG:
    - Page refuse to load after fast reset?? mb
        - Possible cause:
            - itemLocationCountry gets loaded before the state can receive the useParam
            - causing it or override useParam which has the essension q=?? parameter
        - Fix: 
            Removing self calling async function within itemPage useEffect. 
            hopefully that will fix it

MarketPlaceId: https://developer.ebay.com/api-docs/static/rest-request-components.html#HTTP

Specify user location: https://developer.ebay.com/api-docs/buy/static/ref-buy-browse-filters.html#deliveryCountry


Input rough user location of estimate delivery:
    https://developer.ebay.com/api-docs/buy/static/api-browse.html
    X-EBAY-C-ENDUSERCTX: contextualLocation=country%3DUS%2Czip%3D19406 // must be url encoded

    itemSummaries.shippingOptions.minEstimatedDeliveryDate	string	

    The start date of the delivery window (earliest projected delivery date). This value is returned in UTC format (yyyy-MM-ddThh:mm:ss.sssZ), which you can convert into the local time of the buyer.

    Note: For the best accuracy, always include the contextualLocation values in the X-EBAY-C-ENDUSERCTX request header.

    Occurrence: Conditional
