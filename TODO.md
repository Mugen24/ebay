- fixed problem where server is being restarted multiple time

- fixme: incorrect db writes causing addive values instead of replacing
- fixme: singleton sql table: setting
- add: saved query
- add: location selector

- Revamp website UI

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
