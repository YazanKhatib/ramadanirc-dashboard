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
import { Redirect } from "react-router-dom";

export default function (props: any) {

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
    const [redirect, setRedirect] = useState<boolean>(false);

    // API
    const ENDPOINTS = new API()

    const reset_password = () => {

        if(!props.token)
            dispatch( resetPasswordSlice.actions.error(true) )

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

        ENDPOINTS.auth().reset_password({ newPassword: password }, props.token)
        .then((response: any) => {
            dispatch(resetPasswordSlice.actions.success())
        })
        .catch(() => {
            dispatch(resetPasswordSlice.actions.error(true))
        })

    }

    return (
        <div className="login-form">

            { redirect ? <Redirect to="/" /> : ""}

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