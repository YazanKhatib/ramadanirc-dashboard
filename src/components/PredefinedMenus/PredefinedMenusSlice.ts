import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
type select = {
    value: string,
    label: string
}

// Predefined state
export interface predefinedState {
    brands: {
        list: select[],
        isLoaded: boolean
    }
}

const initialPredefinedState: predefinedState = {
    brands: {
        list: [],
        isLoaded: false
    }
}

// Predefined slice
export const predefinedMenusSlice = createSlice({
    name: 'predefined',
    initialState: initialPredefinedState,
    reducers: {
        setBrands: ( state, {payload}: PayloadAction<select[]> ) => {
            state.brands = {
                list: payload,
                isLoaded: true
            }
        }
    }
})