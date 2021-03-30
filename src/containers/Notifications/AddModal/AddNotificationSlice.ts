import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// notNfications state
export interface notification {
    titleEnglish?: string;
    titleFrench?: string;
    bodyEnglish?: string;
    bodyFrench?: string;
    date?: string;
}
export interface addNotificationState {
    fields: notification;
    editId: number,
    isLoading: boolean,
    isSuccess: boolean,
    isOpen: boolean
}

let now = new Date()
now.setSeconds(0, 0)
const initial: addNotificationState = {
    fields: {
        date: now.toLocaleString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            // hour: "2-digit",
            // minute: "2-digit",
            // second: "2-digit"
        }).replace(" ", "T")
    },
    editId: 0,
    isLoading: false,
    isSuccess: false,
    isOpen: false
}

// Add notNfications slice
export const addNotificationSlice = createSlice({
    name: 'add_notification',
    initialState: initial,
    reducers: {
        init: state => initial,
        set: ( state, {payload}: PayloadAction<notification> ) => {
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