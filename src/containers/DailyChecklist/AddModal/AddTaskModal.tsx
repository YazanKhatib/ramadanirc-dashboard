import React, { useState } from 'react'

// Gird system
import { Col, Row } from 'react-grid-system'

// Translation
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { checklistSlice, checklistState, task } from '../DailyChecklistSlice'
import { addTaskSlice, addTaskState } from './AddTaskSlice'

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
    const state = useSelector( ( state: { add_task: addTaskState } ) => state.add_task )

    // Hooks
    const [ showErrors, setShowErrors ] = useState<boolean>(false)

    // API
    const ENDPOINTS = new API()

    const toggle = () => {
        dispatch( addTaskSlice.actions.setIsOpen(false) )
        dispatch( addTaskSlice.actions.init() )
        setShowErrors(false)
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if( !state.fields.name || !state.fields.nameFrench ) {
            setShowErrors(true)
            return
        }

        // Submit
        dispatch(addTaskSlice.actions.setIsLoading(true))

        let api_call = state.editId ? ENDPOINTS.checklist().update : ENDPOINTS.checklist().add

        api_call({
            id: state.editId,
            fixed: false,
            ...state.fields
        })
            .then((response: any) => {
                
                dispatch(addTaskSlice.actions.setIsLoading(false))

                dispatch(addTaskSlice.actions.setIsSuccess(true))

                setTimeout(() => {
                    dispatch( addTaskSlice.actions.init() )
                    dispatch( addTaskSlice.actions.setIsOpen(false) )
                }, 2000);

                // Add to table
                if( state.editId )
                    dispatch(checklistSlice.actions.update(response?.data?.task))
                else
                    dispatch(checklistSlice.actions.add([response?.data?.task]))

            })

    }

    return(
        <Modal open={state.isOpen} toggle={toggle}>
            
            { state.isLoading ? <WhiteboxLoader /> : "" }
            { state.isSuccess ? <SuccessMark /> : "" }

            <h2 className="text-center" style={{ margin: "0 0 20px" }}>
                { state.editId ? t("edit_task") : t("add_task")}
            </h2>

            
        <div className="step2" style={{ width: 500, maxWidth: "90vw" }}>
            <form onSubmit={submit}>

                <Row>
                    <Col md={12}>
                        <InputField
                            rows={4}
                            label={t("name")}
                            error={showErrors && !state.fields.name ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTaskSlice.actions.set({ name: e.target.value }))
                            }}
                            value={state.fields.name} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            rows={4}
                            label={t("name_french")}
                            error={showErrors && !state.fields.nameFrench ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTaskSlice.actions.set({ nameFrench: e.target.value }))
                            }}
                            value={state.fields.nameFrench} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            rows={4}
                            label={t("icon_url")}
                            // error={showErrors && !state.fields.notSelectedIcon ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTaskSlice.actions.set({ notSelectedIcon: e.target.value }))
                            }}
                            value={state.fields.notSelectedIcon} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            rows={4}
                            label={t("selected_icon_url")}
                            // error={showErrors && !state.fields.selectedIcon ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addTaskSlice.actions.set({ selectedIcon: e.target.value }))
                            }}
                            value={state.fields.selectedIcon} />
                    </Col>
                </Row>

                <button className="button round bg-gold color-white margin-top-30" style={{ padding: "0 80px", marginBottom: 5 }}>{t("submit")}</button>

            </form>

        </div>

        </Modal>
    )

}