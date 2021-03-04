import React, { useState } from 'react'

// Gird system
import { Col, Row } from 'react-grid-system'

// Translation
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { usersSlice, usersState, user } from '../UsersSlice'
import { addUserSlice, addUserState } from './AddUserSlice'

// API
import API from '../../../services/api/api'

// Components
import Modal from '../../../components/Modal/Modal'
import { SuccessMark, WhiteboxLoader } from '../../../components/Loader/Loader'
import { InputField, SelectField, Textarea } from '../../../components/FormElements/FormElements'


export default () => {

    // Translation
    const t = useTranslation()
    
    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { add_user: addUserState } ) => state.add_user )

    // Hooks
    const [ showErrors, setShowErrors ] = useState<boolean>(false)

    // API
    const ENDPOINTS = new API()

    // Gender options
    const gender_options = [
        { value: "Male", label: t("male") },
        { value: 'Female', label: t("female") }
    ]

    const toggle = () => {
        dispatch( addUserSlice.actions.setIsOpen(false) )
        dispatch( addUserSlice.actions.init() )
        setShowErrors(false)
    }

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        if( !state.fields.username || !state.fields.email || !state.fields.age || !state.fields.gender || !state.fields.location ) {
            setShowErrors(true)
            return
        }

        // Submit
        dispatch(addUserSlice.actions.setIsLoading(true))

        let api_call = ENDPOINTS.users().update

        api_call({
            id: state.editId,
            ...state.fields,
            age: Number(state.fields.age)
        })
            .then((response: any) => {
                
                dispatch(addUserSlice.actions.setIsLoading(false))

                dispatch(addUserSlice.actions.setIsSuccess(true))

                setTimeout(() => {
                    dispatch( addUserSlice.actions.init() )
                    dispatch( addUserSlice.actions.setIsOpen(false) )
                }, 2000);

                // Add to table
                // let dua: dua = {
                //     id: state.editId ? String(response.data?.data?.updateBrand?.id) : String(response.data?.data?.createBrand?.id),
                //     name: String(state.name ? state.name : "N/A"),
                // }

                // if( state.editId )
                //     dispatch(brandsSlice.actions.updateBrand(brand))
                // else
                //     dispatch(brandsSlice.actions.addBrands([brand]))

            })

    }

    return(
        <Modal open={state.isOpen} toggle={toggle}>
            
            { state.isLoading ? <WhiteboxLoader /> : "" }
            { state.isSuccess ? <SuccessMark /> : "" }

            <h2 className="text-center" style={{ margin: "0 0 20px" }}>
                { state.editId ? t("edit_user") : t("add_user")}
            </h2>

            
        <div className="step2" style={{ width: 500, maxWidth: "90vw" }}>
            <form onSubmit={submit}>

                <Row>
                    <Col md={12}>
                        <InputField
                            label={t("username")}
                            error={showErrors && !state.fields.username ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addUserSlice.actions.set({ username: e.target.value }))
                            }}
                            value={state.fields.username} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            type="email"
                            label={t("email")}
                            error={showErrors && !state.fields.email ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addUserSlice.actions.set({ email: e.target.value }))
                            }}
                            value={state.fields.email} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            type="number"
                            label={t("age")}
                            error={showErrors && !state.fields.age ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addUserSlice.actions.set({ age: Number( e.target.value ) }))
                            }}
                            value={state.fields.age} />
                    </Col>
                    <Col md={12}>
                        <SelectField
                                placeholder={t("gender")}
                                error={showErrors && !state.fields.gender ? t("required_error") : ""}
                                value={state.fields.gender ? gender_options.find( option => option.value === state.fields.gender ) : null}
                                onChange={(option: { value: string }) => dispatch(addUserSlice.actions.set({ gender: option.value }))}
                                options={gender_options} />
                    </Col>
                    <Col md={12}>
                        <InputField
                            label={t("location")}
                            error={showErrors && !state.fields.location ? t("required_error") : ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(addUserSlice.actions.set({ location: e.target.value }))
                            }}
                            value={state.fields.location} />
                    </Col>
                </Row>

                <button className="button round bg-gold color-white margin-top-30" style={{ padding: "0 80px", marginBottom: 5 }}>{t("submit")}</button>

            </form>

        </div>

        </Modal>
    )

}