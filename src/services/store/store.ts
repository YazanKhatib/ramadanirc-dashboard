import { configureStore } from "@reduxjs/toolkit";

// Slices
import { loginSlice } from "../../containers/LoginForm/LoginFormSlice";
import { predefinedMenusSlice } from '../../components/PredefinedMenus/PredefinedMenusSlice'
import { resetPasswordSlice } from "../../containers/ResetPasswordForm/ResetPasswordFormSlice";
import { duasSlice } from "../../containers/DailyDuas/DailyDuasSlice";
import { addDuaSlice } from "../../containers/DailyDuas/AddModal/AddDuaSlice";


const reducer = {
    login: loginSlice.reducer,
    reset_password: resetPasswordSlice.reducer,
    predefined_menus: predefinedMenusSlice.reducer,
    duas: duasSlice.reducer,
    add_dua: addDuaSlice.reducer
}

export default configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production'
})