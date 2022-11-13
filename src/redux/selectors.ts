import { CategoriesType, ChildrenType } from '../types';

//runs when the project is initialized to get a list of root categories
export const getRootCategories = (
    childrenState: ChildrenType,
    categoriesState: CategoriesType,
) => {
    //root categories don't have a parent, so the parent id is marked as null
    return childrenState.null.map((id: string) => categoriesState[id]);
};

//uses current category id as parent id to found out if the current category has the children
export const categoryHasChildren = (
    childrenState: ChildrenType,
    id: string,
) => {
    return childrenState[id]?.length > 0;
};

//uses current category id as parent id to get children ids and then gets the children's data from the main category state
export const getChildrenByParentId = (
    childrenState: ChildrenType,
    categoriesState: CategoriesType,
    id: string,
) => {
    return childrenState[id].map((id: string) => categoriesState[id]);
};

//uses current category id as parent id to get children ids
export const getChildrensIds = (childrenState: ChildrenType, id: string) => {
    return childrenState[id] ? childrenState[id] : null;
};

//gets the checkbox status of the parent of the given category
export const getParentStatus = (
    categoriesState: CategoriesType,
    id: string,
) => {
    const parentId = categoriesState[id].parentId;
    return categoriesState[parentId as string]?.status;
};

//gets the given category checkbox status
export const getStatus = (categoriesState: CategoriesType, id: string) => {
    return categoriesState[id].status;
};

//gets the checkbox status of the children of the given category
export const getChildrenStatus = (
    categoriesState: CategoriesType,
    childrenIds: string[],
) => {
    return childrenIds?.map(
        (childId: string) => categoriesState[childId].status, // [unckece, checked]
    );
};
