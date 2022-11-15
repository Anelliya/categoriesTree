import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import data from '../categories.json';
import { CategoriesType, ChildrenType } from '../types';

// Transforms initial collection to the "HashMap" (object) of key-value pairs
// for faster search by id.
const createCategoriesHashMap = () => {
    return data.reduce((result, category) => {
        return {
            ...result,
            [category.id]: {
                ...category,
                status: 'unchecked',
                checkbox: false,
                matchesSearchTerm: false,
                childrenVisibility: false
            },
        };
    }, {});
};

// Creates a "HashMap" (object) of key-value paris of parentId: childrenIds array
// for faster search of children of given category by its id.
const createChildrenByParentId = () => {
    return data.reduce((result, category) => {
        const { id, parentId } = category;
        const parentIdStr = parentId ? parentId : 'null';
        const prevChildren = result[parentIdStr as keyof object];
        const children: string[] = Array.isArray(prevChildren)
            ? [...prevChildren, id]
            : [id];
        return { ...result, [parentIdStr]: children };
    }, {});
};

const INITIAL_FILTER_STATE = {
    isActive: false,
};

const categories = createSlice({
    name: 'categories',
    initialState: createCategoriesHashMap(),
    reducers: {
        //status is used for category checkbox state
        changeStatus: (
            state: CategoriesType,
            {
                payload: { id, status, childrenIds, childrenState },
            }: PayloadAction<{
                id: string;
                status: string;
                childrenIds: string[] | null;
                childrenState: ChildrenType;
            }>,
        ) => {
            //changes the category status to the current checkbox status
            state[id].status = status;
            if (status === 'indeterminate' || !childrenIds) {
                return;
            }

            let currentChildrenIds: string[] = childrenIds;

            while (currentChildrenIds.length) {
                //changes childrens status to the parent (current category) status
                currentChildrenIds.forEach(childId => {
                    state[childId].status = status;
                });
                //sets the children of current children as currentChildrenIds
                currentChildrenIds = currentChildrenIds
                    .map(childId =>
                        childrenState[childId] ? childrenState[childId] : [],
                    )
                    .flat();
            }
        },
        changeSearchTermMatch: (
            state: CategoriesType,
            { payload }: PayloadAction<string>,
        ) => {
            const searchTerm = payload.toLowerCase();

            const handledCategories: { [index: string]: number } = {};

            //at the beginning sets the category match status to false
            for (const categoryId in state) {
                state[categoryId].matchesSearchTerm = false;
            }

            for (const categoryId in state) {
                let currentCategory = state[categoryId];

                //checks if the current category matches the search
                const matches = currentCategory.name
                    .toLocaleLowerCase()
                    .includes(searchTerm);

                //if the current category does't match the search, moves on to the next category
                if (!matches) {
                    continue;
                }

                //checks if current category has already been handled and moves on to the next category if has been
                if (handledCategories[currentCategory.id]) {
                    continue;
                }

                //updates the current category matchesSearchTerm key to true or false depending on the validation result
                state[currentCategory.id].matchesSearchTerm = matches;

                //enters the condition while the current category has a parent
                while (currentCategory.parentId) {
                    //sets the parent as current category
                    currentCategory = state[currentCategory.parentId];
                    state[currentCategory.id].matchesSearchTerm = matches;
                    //adds current category to handled categories object
                    handledCategories[currentCategory.id] = 1;
                }
            }
        },
        changeChildrenVisibility: (state: CategoriesType,
            {
            payload: { isChildrenVisible, id}
            }: PayloadAction<{ isChildrenVisible : boolean, id: string}>
        ) => {
            state[id].childrenVisibility = isChildrenVisible
        }
    },
});

const filter = createSlice({
    name: 'filter',
    initialState: INITIAL_FILTER_STATE,
    reducers: {
        //isActive is used to indicate if the search is currently in progress
        setIsActive: (
            state: { isActive: boolean },
            { payload }: PayloadAction<boolean>,
        ) => {
            state.isActive = payload;
        },
    },
});

//this state is used for faster search of children by parent id.
const categoriesChildren = createSlice({
    name: 'categoriesChildren',
    initialState: createChildrenByParentId(),
    reducers: {},
});

export const { changeStatus, changeSearchTermMatch, changeChildrenVisibility } =
    categories.actions;
export const { setIsActive } = filter.actions;

export const categoriesReducer = categories.reducer;
export const categoriesChildrenReducer = categoriesChildren.reducer;
export const filterReducer = filter.reducer;
