import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User state
export interface user {
    username?: string;
    email?: string;
    age?: number;
    location?: string;
    gender?: string;
    password?: string;
}
export interface addUserState {
    fields: user;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

const initial: addUserState = {
    fields: {},
    editId: 0,
    isLoading: false,
    isSuccess: false,
    isOpen: false
}

// Add User slice
export const addUserSlice = createSlice({
    name: 'add_user',
    initialState: initial,
    reducers: {
        init: state => initial,
        set: ( state, {payload}: PayloadAction<user> ) => {
            state.fields = { ...state.fields, ...payload }
        },
        setEditId: ( state, {payload}: PayloadAction<number> ) => {
            state.editId = payload
        },
        setIsLoading: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isLoading = payload
        },
        setIsSuccess: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isSuccess = payload
        },
        setIsOpen: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isOpen = payload
        },
    }
})