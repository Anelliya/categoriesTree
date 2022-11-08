import { CategoriesType, ChildrenType } from "../types"


export const getRootCategories = (childrenState: ChildrenType, categoriesState: CategoriesType) => {
    return childrenState.null.map((id: string) => categoriesState[id]);
}   //return first level categories

export const categoryHasChildren = (childrenState: ChildrenType, id: string) => {
    return childrenState[id]?.length > 0 
} // return boolean result

export const getChildrenByParentId = (childrenState: ChildrenType, categoriesState: CategoriesType, id: string) => {
    return childrenState[id].map((id:string) => categoriesState[id])
} // get childrens id's, then map main state by child id and return child data

export const getChildrensIds = (childrenState: ChildrenType, id: string) => {
    return childrenState[id]? childrenState[id] : null
}

export const getParentStatus = (categoriesState: CategoriesType, id: string) => {
    const parentId = categoriesState[id].parentId
    return categoriesState[parentId as string]?.status
}

export const getStatus = (categoriesState: CategoriesType, id: string) => {
   
    return categoriesState[id].status
}

export const getChildrenStatus = (categoriesState: CategoriesType, childrenIds: string[]) => {
    // let childrenStatus: string[] = []
    // childrenIds?.forEach((childId: string) => childrenStatus.push(categoriesState[childId].status))
    return childrenIds?.map((childId: string) => categoriesState[childId].status)

}
