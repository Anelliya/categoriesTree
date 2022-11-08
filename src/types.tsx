export type CategoryType = {
    id: string,
    name: string,
    parentId: string | null,
    status: string
   }

export type CategoriesType = 
 {
    [index: string]: CategoryType
}

export type ChildrenType = {
  [index: string]: [string, string]
}


export type PayloadType = {
  id: string,
  status: string,
  childrenIds: string[] | null
}






