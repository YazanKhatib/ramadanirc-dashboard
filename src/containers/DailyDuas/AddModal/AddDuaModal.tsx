import React, { useState } from 'react'

// Gird system
import { Col, Row } from 'react-grid-system'

// Translation
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { duasSlice, duasState, dua } from '../DailyDuasSlice'
import { addDuaSlice, addDuaState } from './AddDuaSlice'

// API
import API from '../../../services/api/api'

// Components
import Modal from '../../../components/Modal/Modal'
import { SuccessMark, WhiteboxLoader } from '../../../components/Loader/Loader'
import { Textarea } from '../../../components/FormElements/FormElements'


export default () => {

    // Translation
    const t = useTranslation()
    
    // Redux
    const dispatch = useDispatch()
    const brandsState = useSelector( ( state: { duas: duasState } ) => state.duas )
    const state = useSelector( ( state: { add_dua: addDuaState } ) => state.add_dua )

    // Hooks
    const [ showErrors, setShowErrors ] = useState<boolean>(false)

    // API
    const ENDPOINTS = new API()

    const toggle = () => {
        dispatch( addDuaSlice.actions.setIsOpen(false) )
        dispatch( addDuaSlice.actions.init() )
        setShowErrors(false)
    }

    const submitBrand = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if( !state.fields.textArabic || !state.fields.textInbetween || !state.fields.textEnglish || !state.fields.textFrench ) {
            setShowErrors(true)
            return
        }

        // Submit
        dispatch(addDuaSlice.actions.setIsLoading(true))

        let api_call = state.editId ? ENDPOINTS.duas().update : ENDPOINTS.duas().add

        api_call({
            id: state.editId,
            ...state.fields
        })
            .then((response: any) => {
                
                dispatch(addDuaSlice.actions.setIsLoading(false))

                dispatch(addDuaSlice.actions.setIsSuccess(true))

                setTimeout(() => {
                    dispatch( addDuaSlice.actions.init() )
                    dispatch( addDuaSlice.actions.setIsOpen(false) )
                }, 2000);

                // Add to table
                if( state.editId )
                    dispatch(duasSlice.actions.update({
                        id: response?.data?.dua?.id,
                        arabic: response?.data?.dua?.textArabic,
                        english: response?.data?.dua?.textEnglish,
                        inbetween: response?.data?.dua?.textInbetween,
                        french:  response?.data?.dua?.textFrench
                    }))
                else
                    dispatch(duasSlice.actions.add([{
                        id: response?.data?.dua?.id,
                        arabic: response?.data?.dua?.textArabic,
                        english: response?.data?.dua?.textEnglish,
                        inbetween: response?.data?.dua?.textInbetween,
                        french:  response?.data?.dua?.textFrench
                    }]))

            })

    }

    return(
        <Modal open={state.isOpen} toggle={toggle}>
            
            { state.isLoading ? <WhiteboxLoader /> : "" }
            { state.isSuccess ? <SuccessMark /> : "" }

            <h2 className="text-center" style={{ margin: "0 0 20px" }}>
                { state.editId ? t("edit_dua") : t("add_dua")}
            </h2>

            
        <div className="step2" style={{ width: 500, maxWidth: "90vw" }}>
            <form onSubmit={submitBrand}>

                <Row>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("dua_arabic")}
                            error={showErrors && !state.fields.textArabic ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addDuaSlice.actions.set({ textArabic: e.target.value }))
                            }}
                            value={state.fields.textArabic} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("dua_english")}
                            error={showErrors && !state.fields.textEnglish ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addDuaSlice.actions.set({ textEnglish: e.target.value }))
                            }}
                            value={state.fields.textEnglish} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("dua_french")}
                            error={showErrors && !state.fields.textFrench ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addDuaSlice.actions.set({ textFrench: e.target.value }))
                            }}
                            value={state.fields.textFrench} />
                    </Col>
                    <Col md={12} className="add-brand">
                        <Textarea
                            rows={4}
                            label={t("dua_in_between")}
                            error={showErrors && !state.fields.textInbetween ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addDuaSlice.actions.set({ textInbetween: e.target.value }))
                            }}
                            value={state.fields.textInbetween} />
                    </Col>
                </Row>

                <button className="button round bg-gold color-white margin-top-30" style={{ padding: "0 80px", marginBottom: 5 }}>{t("submit")}</button>

            </form>

        </div>

        </Modal>
    )

}