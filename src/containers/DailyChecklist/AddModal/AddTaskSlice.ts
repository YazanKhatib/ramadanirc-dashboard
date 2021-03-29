import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Task state
export interface task {
    name?: string;
    notSelectedIcon?: string;
    selectedIcon?: string;
}
export interface addTaskState {
    fields: task;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

const initial: addTaskState = {
    fields: {},
    editId: 0,
    isLoading: false,
    isSuccess: false,
    isOpen: false
}

// Add Task slice
export const addTaskSlice = createSlice({
    name: 'add_task',
    initialState: initial,
    reducers: {
        init: state => initial,
        set: ( state, {payload}: PayloadAction<task> ) => {
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