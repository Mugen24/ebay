import { ValueOf } from "next/dist/shared/lib/constants";

export interface EbaySearch extends Object {
    q?: string,
    gtin?: string,
    charity_ids?: string,
    fieldgroups?: string,
    compatibility_filter?: CompatibilityFilter,
    auto_correct?: string,
    category_ids?: string,
    filter?: string,
    sort?: SortField,
    limit?: string,
    offset?: string,
    aspect_filter?: AspectFilter,
    epid?: string
}

type _BuyingOption = "FIXED_PRICE" | "AUCTION" | "BEST_OFFER" | "CLASSIFIED_AD";
export type BuyingOptions = 
    | `buyingOptions:{${_BuyingOption}}`
    | `buyingOptions:{${_BuyingOption}|${_BuyingOption}}`
    | `buyingOptions:{${_BuyingOption}|${_BuyingOption}}|${_BuyingOption}`
    | `buyingOptions:{${_BuyingOption}|${_BuyingOption}}|${_BuyingOption}|${_BuyingOption}`

enum ConditionOption {
    NEW = 1000,
    USED = 3000,
}

export type ConditionOptions = 
    | `conditionIds:{${ConditionOption}}`

type CompatibilityFilter = "Not implemented for vehicle requirements"
type FilterField = "filter by price bid etc. https://developer.ebay.com/api-docs/buy/static/ref-buy-browse-filters.html"
export type SortField = "price" | "distance" | "newlyListed" | "endingSoonest"
type AspectFilter = "Not implemented https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search#uri.aspect_filter"

export interface EbaySearchReturn {
    autoCorrections: AutoCorrections;
    href:            string;
    itemSummaries:   ItemSummary[];
    limit:           string;
    next:            string;
    offset:          string;
    prev:            string;
    refinement:      Refinement;
    total:           string;
    warnings:        Warning[];
}

export interface AutoCorrections {
    q: string;
}

export interface ItemSummary {
    additionalImages:           Image[];
    adultOnly:                  string;
    availableCoupons:           string;
    bidCount:                   string;
    buyingOptions:              string[];
    categories:                 Category[];
    compatibilityMatch:         string;
    compatibilityProperties:    CompatibilityProperty[];
    condition:                  string;
    conditionId:                string;
    currentBidPrice:            CurrentBidPrice;
    distanceFromPickupLocation: DistanceFromPickupLocation;
    energyEfficiencyClass:      string;
    epid:                       string;
    image:                      Image;
    itemAffiliateWebUrl:        string;
    itemCreationDate:           string;
    itemEndDate:                string;
    itemGroupHref:              string;
    itemGroupType:              string;
    itemHref:                   string;
    itemId:                     string;
    itemLocation:               ItemLocation;
    itemWebUrl:                 string;
    leafCategoryIds:            string[];
    legacyItemId:               string;
    listingMarketplaceId:       string;
    marketingPrice:             MarketingPrice;
    pickupOptions:              PickupOption[];
    price:                      CurrentBidPrice;
    priceDisplayCondition:      string;
    priorityListing:            string;
    qualifiedPrograms:          string[];
    seller:                     Seller;
    shippingOptions:            ShippingOption[];
    shortDescription:           string;
    thumbnailImages:            Image[];
    title:                      string;
    topRatedBuyingExperience:   string;
    tyreLabelImageUrl:          string;
    unitPrice:                  CurrentBidPrice;
    unitPricingMeasure:         string;
    watchCount:                 string;
}

export interface Image {
    height:   string;
    imageUrl: string;
    width:    string;
}

export interface Category {
    categoryId:   string;
    categoryName: string;
}

export interface CompatibilityProperty {
    localizedName: string;
    name:          string;
    value:         string;
}

export interface CurrentBidPrice {
    convertedFromCurrency: string;
    convertedFromValue:    string;
    currency:              string;
    value:                 string;
}

export interface DistanceFromPickupLocation {
    unitOfMeasure: string;
    value:         string;
}

export interface ItemLocation {
    addressLine1:    string;
    addressLine2:    string;
    city:            string;
    country:         string;
    county:          string;
    postalCode:      string;
    stateOrProvince: string;
}

export interface MarketingPrice {
    discountAmount:     CurrentBidPrice;
    discountPercentage: string;
    originalPrice:      CurrentBidPrice;
    priceTreatment:     string;
}

export interface PickupOption {
    pickupLocationType: string;
}

export interface Seller {
    feedbackPercentage: string;
    feedbackScore:      string;
    sellerAccountType:  string;
    username:           string;
}

export interface ShippingOption {
    guaranteedDelivery:       string;
    maxEstimatedDeliveryDate: string;
    minEstimatedDeliveryDate: string;
    shippingCost:             CurrentBidPrice;
    shippingCostType:         string;
}

export interface Refinement {
    aspectDistributions:       AspectDistribution[];
    buyingOptionDistributions: BuyingOptionDistribution[];
    categoryDistributions:     CategoryDistribution[];
    conditionDistributions:    ConditionDistribution[];
    dominantCategoryId:        string;
}

export interface AspectDistribution {
    aspectValueDistributions: AspectValueDistribution[];
    localizedAspectName:      string;
}

export interface AspectValueDistribution {
    localizedAspectValue: string;
    matchCount:           string;
    refinementHref:       string;
}

export interface BuyingOptionDistribution {
    buyingOption:   string;
    matchCount:     string;
    refinementHref: string;
}

export interface CategoryDistribution {
    categoryId:     string;
    categoryName:   string;
    matchCount:     string;
    refinementHref: string;
}

export interface ConditionDistribution {
    condition:      string;
    conditionId:    string;
    matchCount:     string;
    refinementHref: string;
}

export interface Warning {
    category:     string;
    domain:       string;
    errorId:      string;
    inputRefIds:  string[];
    longMessage:  string;
    message:      string;
    outputRefIds: string[];
    parameters:   Parameter[];
    subdomain:    string;
}

export interface Parameter {
    name:  string;
    value: string;
}