import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
export interface tidbit {
    id: number;
    textEnglish: string;
    textFrench: string;
    active: boolean;
}

// tidbits state
export interface tidbitsState {
    isLoaded: boolean; // First load
    isLoading: boolean; // On delete/update laoder
    isFetching: boolean;
    hasMore: boolean;
    tidbits: tidbit[];
}

const initialState: tidbitsState = {
    isLoaded: false,
    isLoading: false,
    isFetching: false,
    hasMore: false,
    tidbits: [],
}

// tidbits slice
export const tidbitsSlice = createSlice({
    name: 'tidbits',
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
        add: ( state, {payload}: PayloadAction<tidbit[]> ) => {
            state.tidbits = [ ...state.tidbits, ...payload ]
        },
        update: ( state, {payload}: PayloadAction<tidbit> ) => {
            let index = state.tidbits.findIndex( tidbit => tidbit.id === payload.id )
            if( index !== -1 )
                state.tidbits[index] = payload
        },
        setActiveDeed: ( state, {payload}: PayloadAction<{ id: number; }> ) => {
            state.tidbits = state.tidbits.map( tidbit => ({ ...tidbit, active: false }) )
            let index = state.tidbits.findIndex( tidbit => tidbit.id === payload.id )
            if( index !== -1 )
                state.tidbits[index].active = true
        },
        delete: ( state, {payload}: PayloadAction<number[]> ) => {
            payload.map(id => {
                let index = state.tidbits.findIndex( tidbit => tidbit.id === id )
                if( index != -1 )
                    state.tidbits.splice( index, 1 )
            })
        }
    }
})