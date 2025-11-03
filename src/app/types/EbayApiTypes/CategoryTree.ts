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





/////////////////////////////////////////////

export type GetCategorySubtree = {
    "category_tree_id": string // from getDefaultCategoryTreeId
    "category_id": string // the top of the category subtree
}


export interface GetCategorySubtreeResponse {
    categoryTreeId:      string;
    categoryTreeVersion: string;
    categorySubtreeNode: Node;
}

export interface ChildCategoryTreeNode {
    category:                   Category;
    parentCategoryTreeNodeHref: string;
    childCategoryTreeNodes:     Node[];
    categoryTreeNodeLevel:      number;
}

export interface Node {
    category:                   Category;
    parentCategoryTreeNodeHref: string;
    childCategoryTreeNodes?:    ChildCategoryTreeNode[];
    categoryTreeNodeLevel:      number;
}

export interface Category {
    categoryId:   string;
    categoryName: string;
}
