import React, { useState } from "react";

// Translation
import { useTranslation } from "react-multi-lang";

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { resetPasswordSlice, resetPasswordState } from "./ResetPasswordFormSlice";

// Compoentns
import { Checkbox, InputField } from "../../components/FormElements/FormElements";
import { RippleLoader, SuccessMark } from "../../components/Loader/Loader";
import { StaticAlert } from "../../components/Alerts/Alerts";



// Services
import API from '../../services/api/api'

export default function () {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector((state: { reset_password: resetPasswordState }) => state.reset_password)

    // Hooks
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

    // API
    const ENDPOINTS = new API()

    const reset_password = () => {


        if (!password) {
            setPasswordError(t("required_error"))
            return
        }

        if (!confirmPassword) {
            setConfirmPasswordError(t("required_error"))
            return
        }

        if( password !== confirmPassword ) {
            setConfirmPasswordError(t("passwords_didnt_match"))
            return
        }

        dispatch(resetPasswordSlice.actions.load())

        setTimeout(() => {
            dispatch(resetPasswordSlice.actions.success())
        }, 1000);

        // ENDPOINTS.auth().login({ username, password })
        // .then((response: any) => {

        //     if(response.data.data) {

        //         dispatch( loginSlice.actions.success() )
        //         setShowSuccessMark(true)
        //         setTimeout(() => {
        //             let expires: Date = rememberMe ? addToDate( new Date(), "years", 1 ) : addToDate( new Date(), "hours", 1 );
        //             setCookie("userinfo", response.data.data.loginAdmin.user, { expires: expires })
        //             setCookie("token", { accessToken: response.data.data.loginAdmin.accessToken, refreshToken: response.data.data.loginAdmin.refreshToken }, { expires: addToDate( new Date(), "minutes", 29 ) })
        //             dispatch( loginSlice.actions.init() )
        //         }, 1500);

        //     } else {
        //         dispatch( loginSlice.actions.error(true) )
        //     }

        // })
        // .catch((error: any) => {
        //     dispatch( loginSlice.actions.error(true) )
        // })

    }

    return (
        <div className="login-form">

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>

                {
                    state.isError ? <StaticAlert show={true} type={"error"}>{t("login_error")}</StaticAlert> : ""
                }

                {
                    state.isSuccess ? <div className="text-center"><StaticAlert show={true} type={"success"}>{t("reset_success")}</StaticAlert></div> :
                        <>
                            <InputField
                                value={password}
                                type="password"
                                placeholder={t('password')}
                                error={passwordError}
                                disabled={state.isLoading || state.isSuccess}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.currentTarget.value);
                                    setPasswordError("")
                                    if (state.isError) dispatch(resetPasswordSlice.actions.error(false))
                                }} />

                            <InputField
                                value={confirmPassword}
                                type="password"
                                placeholder={t('confirm_password')}
                                error={confirmPasswordError}
                                disabled={state.isLoading || state.isSuccess}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setConfirmPassword(e.currentTarget.value);
                                    setConfirmPasswordError("")
                                    if (state.isError) dispatch(resetPasswordSlice.actions.error(false))
                                }} />

                            <div className="text-center margin-top-40"><button className={"button bg-gold color-white round" + (state.isSuccess ? " scale" : '')} style={{ width: state.isLoading ? 50 : 200 }} onClick={reset_password}>{state.isLoading ? <RippleLoader /> : t('reset_password')}</button></div>
                        </>}

            </form>

        </div>
    )

}