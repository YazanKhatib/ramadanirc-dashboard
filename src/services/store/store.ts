import { configureStore } from "@reduxjs/toolkit";

// Slices
import { loginSlice } from "../../containers/LoginForm/LoginFormSlice";
import { predefinedMenusSlice } from '../../components/PredefinedMenus/PredefinedMenusSlice'
import { resetPasswordSlice } from "../../containers/ResetPasswordForm/ResetPasswordFormSlice";
import { duasSlice } from "../../containers/DailyDuas/DailyDuasSlice";
import { addDuaSlice } from "../../containers/DailyDuas/AddModal/AddDuaSlice";
import { checklistSlice } from "../../containers/DailyChecklist/DailyChecklistSlice";
import { addTaskSlice } from "../../containers/DailyChecklist/AddModal/AddTaskSlice";


const reducer = {
    login: loginSlice.reducer,
    reset_password: resetPasswordSlice.reducer,
    predefined_menus: predefinedMenusSlice.reducer,
    duas: duasSlice.reducer,
    add_dua: addDuaSlice.reducer,
    checklist: checklistSlice.reducer,
    add_task: addTaskSlice.reducer
}

export default configureStore({
    reducer,
    devTools: process.env.NODE_ENV !== 'production'
})