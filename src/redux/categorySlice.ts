import {  PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';

import data from '../categories1.json'
import {CategoriesType, ChildrenType, CategoryType} from '../types'

function createCategoriesHashMap()  {
  return data.reduce((result, category) => ({ ...result, [category.id]: {...category, status: 'unchecked'} }), {});
}

function createChildrenByParentId() {

  return data.reduce((result, category) => {
  const { id, parentId } = category;
  const parentIdStr = parentId ? parentId : 'null';
  
    const prevChildren = result[parentIdStr as keyof Object];
    
    const children: string[] = Array.isArray(prevChildren) ? [...prevChildren, id] : [id];
  
    
    return { ...result, [parentIdStr]: children };
}, {});
}

const categories = createSlice(
  {
    name: 'categories',
    initialState: createCategoriesHashMap(),
    reducers: {
        
      changeStatus: (state: CategoriesType, { payload: { id, status, childrenIds, childrenState } }: PayloadAction<{ id: string, status: string, childrenIds: string[] | null, childrenState: ChildrenType }>) => {
        console.log('children in reducer',childrenIds)
        state[id].status = status;
        if (status === "indeterminate") {
          return
        }
        if (!childrenIds) {
          return
        }

        let currentChildren: string [] | [] = childrenIds
        do {
          currentChildren.forEach(childId => {
            if (state[childId].status !== status) {
              state[childId].status = status
            }
          })
          //console.log('!!!', currentChildren.map(childId => state[childId].status))
          //console.log('current do', currentChildren )
          
          currentChildren = currentChildren.map(childId =>
            childrenState[childId as keyof Object] ? childrenState[childId as keyof Object] : []
          ).flat()
          
          //console.log('current posle', currentChildren )
        } while (currentChildren?.length > 0);
        }
    }  
  },
)

const categoriesChildren = createSlice(
  {
    name: 'categoriesChildren',
    initialState:createChildrenByParentId() , 
    reducers: {

    }
  }
)

export const { changeStatus  } = categories.actions;
export const {  } = categoriesChildren.actions;

export const categoriesReducer = categories.reducer;
export const categoriesChildrenReducer =  categoriesChildren.reducer;
