import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { notification, notificationsSlice, notificationsState } from './NotificationsSlice'
import { addNotificationSlice } from './AddModal/AddNotificationSlice'

// API
import API from '../../services/api/api'

// Components
import TableActionBar from '../../components/TableActionBar/TableActionBar'
import { DashboardTable } from '../../components/Table/Table'
import { EllipsisLoader, WhiteboxLoader } from '../../components/Loader/Loader'
import { SelectField } from '../../components/FormElements/FormElements'
import AddNotificationModal from './AddModal/AddNotificationModal'

export default () => {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { notifications: notificationsState } ) => state.notifications )

    // API
    const ENDPOINTS = new API()

    // Search
    const search = () => {}

    // Fetch Data
    const fetchData = () => {
        
        dispatch( notificationsSlice.actions.setIsFetching(true) )

        ENDPOINTS.notifications().index()
        .then( (response: any) => {
            
            let notifications: notification[] = []

            response.data?.notifications?.map( (item: any) => {
                notifications.push({
                    id: Number(item.id),
                    titleEnglish: String(item.titleEnglish || "N/A"),
                    bodyEnglish: String(item.bodyEnglish || "N/A"),
                    titleFrench: String(item.titleFrench || "N/A"),
                    bodyFrench: String(item.bodyFrench || "N/A"),
                    date: String(item.date || "N/A"),
                    status: String(item.status || "N/A"),
                })
            })

            dispatch( notificationsSlice.actions.add(notifications) )
            dispatch( notificationsSlice.actions.setIsLoaded(true) )
            dispatch( notificationsSlice.actions.setIsFetching(false) )
        })

    }

    interface tableDataType { [key: string]: { [key: string]: any } }
    const generateData: () => tableDataType = () => {
        let data: tableDataType = {}
        state.notifications.map( (item, index) => {
            data[item.id] = {
                title: item.titleEnglish,
                body: item.bodyEnglish,
                title_french: item.titleFrench,
                body_french: item.bodyFrench,
                date: new Date(item.date).toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                status: item.status,
                actions: <div className="show-on-hover">
                            <i className="icon-edit" onClick={(e: React.MouseEvent<HTMLLIElement>) => edit(e, item.id) } />
                            <i className="icon-delete" onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                                e.stopPropagation()
                                remove(item.id)
                            }} />
                        </div>
            }
        })
        return data
    }

    // Edit
    const edit = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
        e.stopPropagation()
        let notificationToEdit = state.notifications.find(notification => notification.id === id)
        if(notificationToEdit) {
            dispatch( addNotificationSlice.actions.set({
                titleEnglish: notificationToEdit.titleEnglish,
                titleFrench: notificationToEdit.titleFrench,
                bodyEnglish: notificationToEdit.bodyEnglish,
                bodyFrench: notificationToEdit.bodyFrench,
                date: new Date(notificationToEdit.date).toLocaleString("sv-SE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }).replace(" ", "T")
            }) )
            dispatch( addNotificationSlice.actions.setEditId(notificationToEdit.id) )
            dispatch( addNotificationSlice.actions.setIsOpen(true) )
        }

    }


    // Toggle Selected id
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const toggleSelectedId = (id: string) => {
        let index = selectedIds.findIndex(selectedId => selectedId === id)
        if( index !== -1 ) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
        } else
            setSelectedIds([...selectedIds, id])
    }

    // Delete
    const remove = (id?: number) => {
        
        dispatch( notificationsSlice.actions.setIsLoading(true) )

        ENDPOINTS.notifications().delete(id || 0)
        .then(() => {
            dispatch( notificationsSlice.actions.setIsLoading(false) )
            dispatch( notificationsSlice.actions.delete([id || 0]) )
            if(!id) setSelectedIds([])
        })

    }


    // First fetch
    useEffect(() => {
        if(!state.isFetching && !state.isLoaded)
            fetchData()
    }, [])

    return(
        <>
            { state.isLoaded ?
            <>
                { state.isLoading ? <WhiteboxLoader /> : ""}
                <TableActionBar
                    title={t("notifications")}
                    // search={search}
                    showFilter={false}
                    showDelete={selectedIds.length > 0}
                    add={() => dispatch( addNotificationSlice.actions.setIsOpen(true) )}
                    addText={t("add_to_notifications")}
                    delete={remove}
                    />
                
                <DashboardTable
                    header={[ t("title"), t("body"), t("title_french"), t("body_french"), t("date"), t("status"), "" ]}
                    body={generateData()}
                    onSelect={toggleSelectedId}
                    hasMore={state.hasMore}
                    loadMore={fetchData}
                    hideSelect={true}
                    />
                
                <AddNotificationModal />

            </> : <div className="center"><EllipsisLoader /></div> }
        </>
    )

}


// import React, { useState } from 'react'

// // Translation
// import { useTranslation } from 'react-multi-lang'

// // Stylesheet
// import './Notifications.css'

// // Assets
// import notifications from '../../assets/images/vector/notifications.svg'

// // Components
// import { Textarea } from '../../components/FormElements/FormElements'

// export default () => {

//     // Translation
//     const t = useTranslation()

//     // React Hooks
//     const [notification, setNotification] = useState<string>("")

//     const sendNotification = (e: React.FormEvent<HTMLFormElement>) => {

//         e.preventDefault()

//     }

//     return(
//         <div className="notifications">
//             <img src={notifications} />
//             <form className="margin-top-30" onSubmit={sendNotification}>
//                 <Textarea
//                     value={notification}
//                     onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotification(e.target.value)}
//                     placeholder={t("notification_text")}
//                     rows={5} />
//                 <button className="button bg-gold color-white round margin-top-20" style={{ padding: "0 50px" }}>{t("send_notification")}</button>
//                 <div className="margin-top-30" />
//             </form>
//         </div>
//     )

// } 