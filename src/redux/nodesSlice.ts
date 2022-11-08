import {  PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit';


type CheckboxStatusType = {
  id: string, 
  status: string
}

const nodesStatus = createSlice(
  {
    name: 'status',
    initialState: [] as CheckboxStatusType[],
    reducers: {
      toggleNodesStatus: (state, { payload }: PayloadAction<CheckboxStatusType>) => {
          state.map(node => node.id === payload.id ? node.status = payload.status : node)
      },
      addNodeStatus: (state, { payload }: PayloadAction<CheckboxStatusType>) => {
        const data = state.find(node => node.id === payload.id)
        if (data) {
          state.map(node => node.id === payload.id ? node.status = payload.status : node)
        } else {

          return [...state, payload]
        }
        
      },
    }  
  },
)

export const { toggleNodesStatus, addNodeStatus } = nodesStatus.actions;
export const nodeStatusReducer =  nodesStatus.reducer;