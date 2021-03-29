import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
export interface task {
    id: number;
    name: string;
    fixed: boolean;
    notSelectedIcon: string;
    selectedIcon: string;
}

// checklist state
export interface checklistState {
    isLoaded: boolean; // First load
    isLoading: boolean; // On delete/update laoder
    isFetching: boolean;
    hasMore: boolean;
    checklist: task[];
}

const initialState: checklistState = {
    isLoaded: false,
    isLoading: false,
    isFetching: false,
    hasMore: false,
    checklist: [],
}

// checklist slice
export const checklistSlice = createSlice({
    name: 'checklist',
    initialState: initialState,
    reducers: {
        setIsLoaded: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isLoaded = payload
        },
        setIsLoading: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isLoading = payload
        },
        setIsFetching: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isFetching = payload
        },
        setHasMore: ( state, {payload}: PayloadAction<boolean> ) => {
            state.hasMore = payload
        },
        add: ( state, {payload}: PayloadAction<task[]> ) => {
            state.checklist = [ ...state.checklist, ...payload ]
        },
        update: ( state, {payload}: PayloadAction<task> ) => {
            let index = state.checklist.findIndex( task => task.id === payload.id )
            if( index !== -1 )
                state.checklist[index] = payload
        },
        toggleFixed: ( state, {payload}: PayloadAction<{ id: number; fixed: boolean }> ) => {
            let index = state.checklist.findIndex( task => task.id === payload.id )
            if( index !== -1 )
                state.checklist[index].fixed = payload.fixed
        },
        delete: ( state, {payload}: PayloadAction<number[]> ) => {
            payload.map(id => {
                let index = state.checklist.findIndex( task => task.id === id )
                if( index != -1 )
                    state.checklist.splice( index, 1 )
            })
        }
    }
})