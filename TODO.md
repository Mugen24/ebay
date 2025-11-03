- item pagination
- feature: notification when auction item is ending + show relative date in UI
- fix: ui scaling
- UI overhaul


- fixme: singleton sql table: setting
- Revamp website UI
- query of sub categories of parent when clicked
- removing category does not refresh the ebay item content

BUGS:
- Basically the readerstream created by transformstream is locked
    - when the api is called this is what we get
    ```js
    TypeError: Response body object should not be disturbed or locked
    at GET (src/app/server/api/setting/watch/stream/route.tsx:16:17)
  14 |
  15 |
> 16 |     const resp = new Response(readableStream, {
     |                 ^
  17 |         headers: {
  18 |             "Content-Type": "text/event-stream",
  19 |             "Cache-Control": "no-store, no-cache",
 GET /server/api/setting/watch/stream 500 in 36ms
    ```

// TODO: may need to explicitly translate data from search and getItem call


MarketPlaceId: https://developer.ebay.com/api-docs/static/rest-request-components.html#HTTP

Specify user location: https://developer.ebay.com/api-docs/buy/static/ref-buy-browse-filters.html#deliveryCountry


Input rough user location of estimate delivery:
    https://developer.ebay.com/api-docs/buy/static/api-browse.html
    X-EBAY-C-ENDUSERCTX: contextualLocation=country%3DUS%2Czip%3D19406 // must be url encoded

    itemSummaries.shippingOptions.minEstimatedDeliveryDate	string	

    The start date of the delivery window (earliest projected delivery date). This value is returned in UTC format (yyyy-MM-ddThh:mm:ss.sssZ), which you can convert into the local time of the buyer.

    Note: For the best accuracy, always include the contextualLocation values in the X-EBAY-C-ENDUSERCTX request header.

    Occurrence: Conditional

## Bugs
- [ ] TypeError: Response body object should not be disturbed or locked
    - src/app/server/api/setting/watch/stream/route.tsx:41:11
    - Specific problem with consuming the body response?
    - Various sources suggests that it could be a client problem
