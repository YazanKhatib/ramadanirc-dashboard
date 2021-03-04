import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
export interface user {
    id: number;
    username: string;
    email: string;
    location: string;
    age: number;
    gender: string;
}

// users state
export interface usersState {
    isLoaded: boolean; // First load
    isLoading: boolean; // On delete/update laoder
    isFetching: boolean;
    hasMore: boolean;
    users: user[];
}

const initialState: usersState = {
    isLoaded: false,
    isLoading: false,
    isFetching: false,
    hasMore: false,
    users: [],
}

// users slice
export const usersSlice = createSlice({
    name: 'users',
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
        add: ( state, {payload}: PayloadAction<user[]> ) => {
            state.users = [ ...state.users, ...payload ]
        },
        update: ( state, {payload}: PayloadAction<user> ) => {
            let index = state.users.findIndex( user => user.id === payload.id )
            if( index !== -1 )
                state.users[index] = payload
        },
        delete: ( state, {payload}: PayloadAction<number[]> ) => {
            payload.map(id => {
                let index = state.users.findIndex( user => user.id === id )
                if( index != -1 )
                    state.users.splice( index, 1 )
            })
        }
    }
})