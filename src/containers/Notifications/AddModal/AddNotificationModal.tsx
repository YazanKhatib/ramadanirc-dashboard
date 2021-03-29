import React, { useState } from 'react'

// Gird system
import { Col, Row } from 'react-grid-system'

// Translation
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { notificationsSlice, notificationsState, notification } from '../NotificationsSlice'
import { addNotificationSlice, addNotificationState } from './AddNotificationSlice'

// API
import API from '../../../services/api/api'

// Components
import Modal from '../../../components/Modal/Modal'
import { SuccessMark, WhiteboxLoader } from '../../../components/Loader/Loader'
import { InputField, Textarea } from '../../../components/FormElements/FormElements'


export default () => {

    // Translation
    const t = useTranslation()
    
    // Redux
    const dispatch = useDispatch()
    const brandsState = useSelector( ( state: { notifications: notificationsState } ) => state.notifications )
    const state = useSelector( ( state: { add_notification: addNotificationState } ) => state.add_notification )

    // Hooks
    const [ showErrors, setShowErrors ] = useState<boolean>(false)

    // API
    const ENDPOINTS = new API()

    const toggle = () => {
        dispatch( addNotificationSlice.actions.setIsOpen(false) )
        dispatch( addNotificationSlice.actions.init() )
        setShowErrors(false)
    }

    const submitBrand = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if( !state.fields.titleEnglish || !state.fields.titleFrench || !state.fields.bodyEnglish || !state.fields.bodyFrench ) {
            setShowErrors(true)
            return
        }

        // Submit
        dispatch(addNotificationSlice.actions.setIsLoading(true))

        let api_call = state.editId ? ENDPOINTS.notifications().update : ENDPOINTS.notifications().add
        let date = new Date(state.fields.date || "").toISOString()
        api_call({
            id: state.editId,
            ...state.fields,
            date
        })
            .then((response: any) => {
                
                dispatch(addNotificationSlice.actions.setIsLoading(false))

                dispatch(addNotificationSlice.actions.setIsSuccess(true))

                setTimeout(() => {
                    dispatch( addNotificationSlice.actions.init() )
                    dispatch( addNotificationSlice.actions.setIsOpen(false) )
                }, 2000);

                // Add to table
                if( state.editId )
                    dispatch(notificationsSlice.actions.update({
                        id: response?.data?.notification?.id,
                        titleEnglish: response?.data?.notification?.titleEnglish,
                        titleFrench: response?.data?.notification?.titleFrench,
                        bodyEnglish: response?.data?.notification?.bodyEnglish,
                        bodyFrench: response?.data?.notification?.bodyFrench,
                        date: response?.data?.notification?.date,
                        status: response?.data?.notification?.status
                    }))
                else
                    dispatch(notificationsSlice.actions.add([{
                        id: response?.data?.notification?.id,
                        titleEnglish: response?.data?.notification?.titleEnglish,
                        titleFrench: response?.data?.notification?.titleFrench,
                        bodyEnglish: response?.data?.notification?.bodyEnglish,
                        bodyFrench: response?.data?.notification?.bodyFrench,
                        date: response?.data?.notification?.date,
                        status: response?.data?.notification?.status
                    }]))

            })

    }

    return(
        <Modal open={state.isOpen} toggle={toggle}>
            
            { state.isLoading ? <WhiteboxLoader /> : "" }
            { state.isSuccess ? <SuccessMark /> : "" }

            <h2 className="text-center" style={{ margin: "0 0 20px" }}>
                { state.editId ? t("edit_notification") : t("add_notification")}
            </h2>

            
        <div className="step2" style={{ width: 500, maxWidth: "90vw" }}>
            <form onSubmit={submitBrand}>

                <Row>
                    <Col md={12} className="add-brand">
                        <InputField
                            label={t("title_english")}
                            error={showErrors && !state.fields.titleEnglish ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addNotificationSlice.actions.set({ titleEnglish: e.target.value }))
                            }}
                            value={state.fields.titleEnglish} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <InputField
                            label={t("title_french")}
                            error={showErrors && !state.fields.titleFrench ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addNotificationSlice.actions.set({ titleFrench: e.target.value }))
                            }}
                            value={state.fields.titleFrench} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("body_english")}
                            error={showErrors && !state.fields.bodyEnglish ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addNotificationSlice.actions.set({ bodyEnglish: e.target.value }))
                            }}
                            value={state.fields.bodyEnglish} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("body_french")}
                            error={showErrors && !state.fields.bodyFrench ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addNotificationSlice.actions.set({ bodyFrench: e.target.value }))
                            }}
                            value={state.fields.bodyFrench} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <InputField
                            type="datetime-local"
                            label={t("date")}
                            error={showErrors && !state.fields.date ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                let date = new Date(e.target.value)
                                dispatch(addNotificationSlice.actions.set({ date: date.toLocaleString("sv-SE", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                }).replace(" ", "T") }))
                            }}
                            value={state.fields.date} />
                    </Col>
                </Row>

                <button className="button round bg-gold color-white margin-top-30" style={{ padding: "0 80px", marginBottom: 5 }}>{t("submit")}</button>

            </form>

        </div>

        </Modal>
    )

}