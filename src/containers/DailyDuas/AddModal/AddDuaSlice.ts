import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Duas state
export interface dua {
    textArabic?: string;
    textInbetween?: string;
    textEnglish?: string;
}
export interface addDuaState {
    fields: dua;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

const initial: addDuaState = {
    fields: {},
    editId: 0,
    isLoading: false,
    isSuccess: false,
    isOpen: false
}

// Add Duas slice
export const addDuaSlice = createSlice({
    name: 'add_dua',
    initialState: initial,
    reducers: {
        init: state => initial,
        set: ( state, {payload}: PayloadAction<dua> ) => {
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