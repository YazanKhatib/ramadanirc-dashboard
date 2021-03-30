import React, { useState } from 'react'

// Gird system
import { Col, Row } from 'react-grid-system'

// Translation
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { tidbitsSlice, tidbitsState, tidbit } from '../TidbitsSlice'
import { addTidbitSlice, addTidbitState } from './AddTidbitSlice'

// API
import API from '../../../services/api/api'

// Components
import Modal from '../../../components/Modal/Modal'
import { SuccessMark, WhiteboxLoader } from '../../../components/Loader/Loader'
import { InputField, Textarea } from '../../../components/FormElements/FormElements'
import { formatDate } from '../../../services/hoc/helpers'


export default () => {

    // Translation
    const t = useTranslation()
    
    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { add_tidbit: addTidbitState } ) => state.add_tidbit )

    // Hooks
    const [ showErrors, setShowErrors ] = useState<boolean>(false)

    // API
    const ENDPOINTS = new API()

    const toggle = () => {
        dispatch( addTidbitSlice.actions.setIsOpen(false) )
        dispatch( addTidbitSlice.actions.init() )
        setShowErrors(false)
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if( !state.fields.textEnglish || !state.fields.textFrench ) {
            setShowErrors(true)
            return
        }

        // Submit
        dispatch(addTidbitSlice.actions.setIsLoading(true))

        let api_call = state.editId ? ENDPOINTS.tidbits().update : ENDPOINTS.tidbits().add

        api_call({
            id: state.editId,
            textEnglish: state.fields.textEnglish,
            textFrench: state.fields.textFrench,
            ...state.fields
        })
        .then((response: any) => {

            ENDPOINTS.deed_of_the_day().set({ id: response?.data?.tidbit?.id, value: formatDate(new Date(state.fields.deed_of_the_day || "")) })
            .then((deed_response: any) => {
                dispatch(addTidbitSlice.actions.setIsLoading(false))
    
                dispatch(addTidbitSlice.actions.setIsSuccess(true))
    
                setTimeout(() => {
                    dispatch( addTidbitSlice.actions.init() )
                    dispatch( addTidbitSlice.actions.setIsOpen(false) )
                }, 2000);
    
                // Add to table
                if( state.editId )
                    dispatch(tidbitsSlice.actions.update({
                        active: false,
                        id: response?.data?.tidbit?.id,
                        textEnglish: response?.data?.tidbit?.textEnglish,
                        textFrench: response?.data?.tidbit?.textFrench,
                        deed_of_the_day: new Date(state.fields.deed_of_the_day || "").toISOString()
                    }))
                else
                    dispatch(tidbitsSlice.actions.add([{
                        active: false,
                        id: response?.data?.tidbit?.id,
                        textEnglish: response?.data?.tidbit?.textEnglish,
                        textFrench: response?.data?.tidbit?.textFrench,
                        deed_of_the_day: new Date(state.fields.deed_of_the_day || "").toISOString()
                    }]))
            })
            

        })

    }

    return(
        <Modal open={state.isOpen} toggle={toggle}>
            
            { state.isLoading ? <WhiteboxLoader /> : "" }
            { state.isSuccess ? <SuccessMark /> : "" }

            <h2 className="text-center" style={{ margin: "0 0 20px" }}>
                { state.editId ? t("edit_tidbit") : t("add_tidbit")}
            </h2>

            
        <div className="step2" style={{ width: 500, maxWidth: "90vw" }}>
            <form onSubmit={submit}>

                <Row>
                    <Col md={12}>
                        <Textarea
                            rows={4}
                            label={t("text_english")}
                            error={showErrors && !state.fields.textEnglish ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTidbitSlice.actions.set({ textEnglish: e.target.value }))
                            }}
                            value={state.fields.textEnglish} />
                    </Col>
                    <Col md={12}>
                        <Textarea
                            rows={4}
                            label={t("text_french")}
                            error={showErrors && !state.fields.textFrench ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTidbitSlice.actions.set({ textFrench: e.target.value }))
                            }}
                            value={state.fields.textFrench} />
                    </Col>
                </Row>
                <Col md={12} className="add-brand">
                    <InputField
                        type="date"
                        label={t("deed_of_the_day")}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let date = new Date(e.target.value)
                            dispatch(addTidbitSlice.actions.set({ deed_of_the_day: date.toLocaleString("sv-SE", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            }).replace(" ", "T") }))
                        }}
                        value={state.fields.deed_of_the_day} />
                </Col>

                <button className="button round bg-gold color-white margin-top-30" style={{ padding: "0 80px", marginBottom: 5 }}>{t("submit")}</button>

            </form>

        </div>

        </Modal>
    )

}