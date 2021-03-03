import React from 'react'
import { useTranslation } from 'react-multi-lang'
import { EllipsisLoader } from '../Loader/Loader'
import Modal from '../Modal/Modal'

import './DetailsModal.css'

interface DetailsModalProps {
    isOpen: boolean,
    toggle: Function,
    isLoading?: boolean,
    title?: string,
    data: {
        [key: string]: any
    }
}


export default (props: DetailsModalProps) => {
    // Translation
    const t = useTranslation()
    return <Modal open={props.isOpen} toggle={props.toggle}>
        { props.isLoading ?
        <div className="center"><EllipsisLoader /></div> :
        <>
        { props.title ? <h3 className="details-modal-title">{props.title}</h3> : "" }
        <table className="details-table">
            { Object.keys(props.data).map( (key, index) => (
                <tr key={key}>
                    <td>{t(key)}</td>
                    <td>{props.data[key]}</td>
                </tr>
            )) }
        </table>
        </> }
    </Modal>
}