import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Models
export interface notification {
    id: number;
    titleEnglish: string;
    titleFrench: string;
    bodyEnglish: string;
    bodyFrench: string;
    date: string;
    status: string;
}

// notifications state
export interface notificationsState {
    isLoaded: boolean; // First load
    isLoading: boolean; // On delete/update laoder
    isFetching: boolean;
    hasMore: boolean;
    notifications: notification[];
}

const initialState: notificationsState = {
    isLoaded: false,
    isLoading: false,
    isFetching: false,
    hasMore: false,
    notifications: [],
}

// notifications slice
export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
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
        add: ( state, {payload}: PayloadAction<notification[]> ) => {
            state.notifications = [ ...state.notifications, ...payload ]
        },
        update: ( state, {payload}: PayloadAction<notification> ) => {
            let index = state.notifications.findIndex( notification => notification.id === payload.id )
            alert(index)
            if( index !== -1 )
                state.notifications[index] = payload
        },
        delete: ( state, {payload}: PayloadAction<number[]> ) => {
            payload.map(id => {
                let index = state.notifications.findIndex( notification => notification.id === id )
                if( index != -1 )
                    state.notifications.splice( index, 1 )
            })
        }
    }
})