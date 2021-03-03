import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Reset password state
export interface resetPasswordState {
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean
}

const initialResetPasswordState: resetPasswordState = {
    isLoading: false,
    isSuccess: false,
    isError: false
}

// Reset password slice
export const resetPasswordSlice = createSlice({
    name: 'reset_password',
    initialState: initialResetPasswordState,
    reducers: {
        init: state => initialResetPasswordState,
        load: ( state ) => {
            state.isLoading = true
        },
        success: ( state ) => {
            state.isSuccess = true
        },
        error: ( state, {payload}: PayloadAction<boolean> ) => {
            state.isLoading = false
            state.isError = payload
        },
    }
})