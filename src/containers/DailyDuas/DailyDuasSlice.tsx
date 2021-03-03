import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
export interface dua {
    id: number;
    arabic: string;
    inbetween: string;
    english: string;
}

// Duas state
export interface duasState {
    isLoaded: boolean; // First load
    isLoading: boolean; // On delete/update laoder
    isFetching: boolean;
    hasMore: boolean;
    duas: dua[];
}

const initialState: duasState = {
    isLoaded: false,
    isLoading: false,
    isFetching: false,
    hasMore: false,
    duas: [],
}

// Duas slice
export const duasSlice = createSlice({
    name: 'duas',
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
        add: ( state, {payload}: PayloadAction<dua[]> ) => {
            state.duas = [ ...state.duas, ...payload ]
        },
        update: ( state, {payload}: PayloadAction<dua> ) => {
            let index = state.duas.findIndex( dua => dua.id === payload.id )
            alert(index)
            if( index !== -1 )
                state.duas[index] = payload
        },
        delete: ( state, {payload}: PayloadAction<number[]> ) => {
            payload.map(id => {
                let index = state.duas.findIndex( dua => dua.id === id )
                if( index != -1 )
                    state.duas.splice( index, 1 )
            })
        }
    }
})