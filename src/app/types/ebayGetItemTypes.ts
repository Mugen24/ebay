export type ebayGetItem = {
    item_id: string,
    fieldgroups: "PRODUCT" | "COMPACT" | "ADDITIONAL_SELLER_DETAILS"
}

export interface EbayGetItemReturn {
    additionalImages:           Image[];
    addonServices:              AddonService[];
    adultOnly:                  string;
    ageGroup:                   AgeGroup;
    authenticityGuarantee:      Authenticity;
    authenticityVerification:   Authenticity;
    availableCoupons:           AvailableCoupon[];
    bidCount:                   string;
    brand:                      AgeGroup;
    buyingOptions:              AgeGroup[];
    categoryId:                 AgeGroup;
    categoryIdPath:             AgeGroup;
    categoryPath:               AgeGroup;
    color:                      AgeGroup;
    condition:                  AgeGroup;
    conditionDescription:       AgeGroup;
    conditionDescriptors:       ConditionDescriptor[];
    conditionId:                AgeGroup;
    currentBidPrice:            CurrentBidPrice;
    description:                AgeGroup;
    ecoParticipationFee:        CurrentBidPrice;
    eligibleForInlineCheckout:  string;
    enabledForGuestCheckout:    string;
    energyEfficiencyClass:      AgeGroup;
    epid:                       AgeGroup;
    estimatedAvailabilities:    EstimatedAvailability[];
    gender:                     AgeGroup;
    gtin:                       AgeGroup;
    hazardousMaterialsLabels:   HazardousMaterialsLabels;
    image:                      Image;
    inferredEpid:               AgeGroup;
    itemAffiliateWebUrl:        AgeGroup;
    itemCreationDate:           AgeGroup;
    itemEndDate:                AgeGroup;
    itemId:                     AgeGroup;
    itemLocation:               ItemLocation;
    itemWebUrl:                 AgeGroup;
    legacyItemId:               AgeGroup;
    listingMarketplaceId:       string;
    localizedAspects:           LocalizedAspect[];
    lotSize:                    string;
    marketingPrice:             MarketingPrice;
    material:                   AgeGroup;
    minimumPriceToBid:          CurrentBidPrice;
    mpn:                        AgeGroup;
    pattern:                    AgeGroup;
    paymentMethods:             PaymentMethod[];
    price:                      CurrentBidPrice;
    priceDisplayCondition:      string;
    primaryItemGroup:           PrimaryItemGroup;
    primaryProductReviewRating: PrimaryProductReviewRating;
    priorityListing:            string;
    product:                    Product;
    productFicheWebUrl:         AgeGroup;
    qualifiedPrograms:          AgeGroup[];
    quantityLimitPerBuyer:      string;
    repairScore:                AgeGroup;
    reservePriceMet:            string;
    returnTerms:                ReturnTerms;
    seller:                     Seller;
    sellerCustomPolicies:       SellerCustomPolicy[];
    sellerItemRevision:         AgeGroup;
    shippingOptions:            ShippingOption[];
    shipToLocations:            ShipToLocations;
    shortDescription:           AgeGroup;
    size:                       AgeGroup;
    sizeSystem:                 AgeGroup;
    sizeType:                   AgeGroup;
    subtitle:                   AgeGroup;
    taxes:                      Tax[];
    title:                      AgeGroup;
    topRatedBuyingExperience:   string;
    tyreLabelImageUrl:          AgeGroup;
    uniqueBidderCount:          string;
    unitPrice:                  CurrentBidPrice;
    unitPricingMeasure:         AgeGroup;
    warnings:                   Warning[];
    watchCount:                 string;
}

export interface Image {
    height:   string;
    imageUrl: AgeGroup;
    width:    string;
}

export enum AgeGroup {
    String = "string",
}

export interface AddonService {
    selection:   string;
    serviceFee:  CurrentBidPrice;
    serviceId:   AgeGroup;
    serviceType: string;
}

export interface CurrentBidPrice {
    convertedFromCurrency: string;
    convertedFromValue:    AgeGroup;
    currency:              string;
    value:                 AgeGroup;
}

export interface Authenticity {
    description: AgeGroup;
    termsWebUrl: AgeGroup;
}

export interface AvailableCoupon {
    constraint:     Constraint;
    discountAmount: DiscountAmount;
    discountType:   string;
    message:        AgeGroup;
    redemptionCode: AgeGroup;
    termsWebUrl:    AgeGroup;
}

export interface Constraint {
    expirationDate: AgeGroup;
}

export interface DiscountAmount {
    currency: string;
    value:    AgeGroup;
}

export interface ConditionDescriptor {
    name:   AgeGroup;
    values: Value[];
}

export interface Value {
    additionalInfo: AgeGroup[];
    content:        AgeGroup;
}

export interface EstimatedAvailability {
    availabilityThreshold:       string;
    availabilityThresholdType:   string;
    deliveryOptions:             string[];
    estimatedAvailabilityStatus: string;
    estimatedAvailableQuantity:  string;
    estimatedSoldQuantity:       string;
}

export interface HazardousMaterialsLabels {
    additionalInformation: AgeGroup;
    pictograms:            Pictogram[];
    signalWord:            AgeGroup;
    signalWordId:          AgeGroup;
    statements:            Statement[];
}

export interface Pictogram {
    pictogramDescription: AgeGroup;
    pictogramId:          AgeGroup;
    pictogramUrl:         AgeGroup;
}

export interface Statement {
    statementDescription: AgeGroup;
    statementId:          AgeGroup;
}

export interface ItemLocation {
    addressLine1:    AgeGroup;
    addressLine2:    AgeGroup;
    city:            AgeGroup;
    country:         string;
    county:          AgeGroup;
    postalCode:      AgeGroup;
    stateOrProvince: AgeGroup;
    countryName?:    AgeGroup;
}

export interface LocalizedAspect {
    name:  AgeGroup;
    type:  string;
    value: AgeGroup;
}

export interface MarketingPrice {
    discountAmount:     CurrentBidPrice;
    discountPercentage: AgeGroup;
    originalPrice:      CurrentBidPrice;
    priceTreatment:     string;
}

export interface PaymentMethod {
    paymentMethodType:   string;
    paymentMethodBrands: PaymentMethodBrand[];
    paymentInstructions: string[];
    sellerInstructions:  string[];
}

export interface PaymentMethodBrand {
    paymentMethodBrandType: string;
    logoImage:              Image;
}

export interface PrimaryItemGroup {
    itemGroupAdditionalImages: Image[];
    itemGroupHref:             AgeGroup;
    itemGroupId:               AgeGroup;
    itemGroupImage:            Image;
    itemGroupTitle:            AgeGroup;
    itemGroupType:             string;
}

export interface PrimaryProductReviewRating {
    averageRating:    AgeGroup;
    ratingHistograms: RatingHistogram[];
    reviewCount:      string;
}

export interface RatingHistogram {
    count:  string;
    rating: AgeGroup;
}

export interface Product {
    additionalImages:            Image[];
    additionalProductIdentities: AdditionalProductIdentity[];
    aspectGroups:                AspectGroup[];
    brand:                       AgeGroup;
    description:                 AgeGroup;
    gtins:                       AgeGroup[];
    image:                       Image;
    mpns:                        AgeGroup[];
    title:                       AgeGroup;
}

export interface AdditionalProductIdentity {
    productIdentity: ProductIdentity[];
}

export interface ProductIdentity {
    identifierType:  AgeGroup;
    identifierValue: AgeGroup;
}

export interface AspectGroup {
    aspects:            Aspect[];
    localizedGroupName: AgeGroup;
}

export interface Aspect {
    localizedName:   AgeGroup;
    localizedValues: AgeGroup[];
}

export interface ReturnTerms {
    extendedHolidayReturnsOffered: string;
    refundMethod:                  string;
    restockingFeePercentage:       AgeGroup;
    returnInstructions:            AgeGroup;
    returnMethod:                  string;
    returnPeriod:                  ReturnPeriod;
    returnsAccepted:               string;
    returnShippingCostPayer:       string;
}

export interface ReturnPeriod {
    unit:  string;
    value: string;
}

export interface Seller {
    feedbackPercentage: AgeGroup;
    feedbackScore:      string;
    sellerAccountType:  AgeGroup;
    sellerLegalInfo:    SellerLegalInfo;
    userId:             AgeGroup;
    username:           AgeGroup;
}

export interface SellerLegalInfo {
    email:                      AgeGroup;
    fax:                        AgeGroup;
    imprint:                    AgeGroup;
    legalContactFirstName:      AgeGroup;
    legalContactLastName:       AgeGroup;
    name:                       AgeGroup;
    phone:                      AgeGroup;
    registrationNumber:         AgeGroup;
    sellerProvidedLegalAddress: ItemLocation;
    termsOfService:             AgeGroup;
    vatDetails:                 VatDetail[];
    economicOperator:           EconomicOperator;
    weeeNumber:                 AgeGroup;
}

export interface EconomicOperator {
    companyName:     AgeGroup;
    addressLine1:    AgeGroup;
    addressLine2:    AgeGroup;
    city:            AgeGroup;
    stateOrProvince: AgeGroup;
    postalCode:      AgeGroup;
    country:         AgeGroup;
    phone:           AgeGroup;
    email:           AgeGroup;
}

export interface VatDetail {
    issuingCountry: string;
    vatId:          AgeGroup;
}

export interface SellerCustomPolicy {
    description: AgeGroup;
    label:       AgeGroup;
    type:        string;
}

export interface ShipToLocations {
    regionExcluded: RegionCluded[];
    regionIncluded: RegionCluded[];
}

export interface RegionCluded {
    regionId:   AgeGroup;
    regionName: AgeGroup;
    regionType: string;
}

export interface ShippingOption {
    additionalShippingCostPerUnit: CurrentBidPrice;
    cutOffDateUsedForEstimate:     AgeGroup;
    fulfilledThrough:              string;
    guaranteedDelivery:            string;
    importCharges:                 CurrentBidPrice;
    maxEstimatedDeliveryDate:      AgeGroup;
    minEstimatedDeliveryDate:      AgeGroup;
    quantityUsedForEstimate:       string;
    shippingCarrierCode:           AgeGroup;
    shippingCost:                  CurrentBidPrice;
    shippingCostType:              AgeGroup;
    shippingServiceCode:           AgeGroup;
    shipToLocationUsedForEstimate: ShipToLocationUsedForEstimate;
    trademarkSymbol:               AgeGroup;
    type:                          AgeGroup;
}

export interface ShipToLocationUsedForEstimate {
    country:    string;
    postalCode: AgeGroup;
}

export interface Tax {
    ebayCollectAndRemitTax:   string;
    includedInPrice:          string;
    shippingAndHandlingTaxed: string;
    taxJurisdiction:          TaxJurisdiction;
    taxPercentage:            AgeGroup;
    taxType:                  string;
}

export interface TaxJurisdiction {
    region:            Region;
    taxJurisdictionId: AgeGroup;
}

export interface Region {
    regionName: AgeGroup;
    regionType: string;
}

export interface Warning {
    category:     AgeGroup;
    domain:       AgeGroup;
    errorId:      string;
    inputRefIds:  AgeGroup[];
    longMessage:  AgeGroup;
    message:      AgeGroup;
    outputRefIds: AgeGroup[];
    parameters:   Parameter[];
    subdomain:    AgeGroup;
}

export interface Parameter {
    name:  AgeGroup;
    value: AgeGroup;
}
