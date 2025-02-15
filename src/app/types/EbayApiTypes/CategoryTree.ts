import { MarketplaceId } from "../marketplaceIds"

export type GetDefaultCategoryTreeRequest = {
    marketplace_id: MarketplaceId
}

export type GetDefaultCategoryTreeResponse = {
    "categoryTreeId" : string,
    "categoryTreeVersion" : string
}

export type GetCategoryTreeRequest = {
    "category_tree_id": string
}

export interface GetCategoryTreeResponse {
    applicableMarketplaceIds: string[];
    categoryTreeId:           string;
    categoryTreeVersion:      string;
    rootCategoryNode:         RootCategoryNode;
}

export interface RootCategoryNode {
    category:                   Category;
    categoryTreeNodeLevel:      string;
    childCategoryTreeNodes:     RootCategoryNodeChildCategoryTreeNode[];
    leafCategoryTreeNode:       string;
    parentCategoryTreeNodeHref: string;
}

export interface Category {
    categoryId:   string;
    categoryName: string;
}

export interface RootCategoryNodeChildCategoryTreeNode {
    category:                   Category;
    categoryTreeNodeLevel:      string;
    childCategoryTreeNodes:     RootCategoryNodeChildCategoryTreeNode[];
    leafCategoryTreeNode:       boolean;
    parentCategoryTreeNodeHref: string;
}
