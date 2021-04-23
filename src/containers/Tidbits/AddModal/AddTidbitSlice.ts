import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tidbit state
export interface tidbit {
    textEnglish?: string;
    textFrench?: string;
    deed_of_the_day?: string;
}
export interface addTidbitState {
    fields: tidbit;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

let date = new Date()
date.setHours(13, 0, 0, 0)

const initial: addTidbitState = {
    fields: {
        deed_of_the_day: date.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        })
    },
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