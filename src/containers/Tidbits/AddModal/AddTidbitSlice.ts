import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tidbit state
export interface tidbit {
    textEnglish?: string;
    textFrench?: string;
}
export interface addTidbitState {
    fields: tidbit;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

const initial: addTidbitState = {
    fields: {},
    editId: 0,
    isLoading: false,
    isSuccess: false,
    isOpen: false
}

// Add Tidbit slice
export const addTidbitSlice = createSlice({
    name: 'add_tidbit',
    initialState: initial,
    reducers: {
        init: state => initial,
        set: ( state, {payload}: PayloadAction<tidbit> ) => {
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