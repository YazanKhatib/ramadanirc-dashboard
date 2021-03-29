import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { user, usersSlice, usersState } from './UsersSlice'
import { addUserSlice } from './AddModal/AddUserSlice'

// API
import API from '../../services/api/api'

// Components
import TableActionBar from '../../components/TableActionBar/TableActionBar'
import { DashboardTable } from '../../components/Table/Table'
import { EllipsisLoader, WhiteboxLoader } from '../../components/Loader/Loader'
import { SelectField } from '../../components/FormElements/FormElements'
import AddUserModal from './AddModal/AddUserModal'
import { formatDate } from '../../services/hoc/helpers'

export default () => {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { users: usersState } ) => state.users )

    // API
    const ENDPOINTS = new API()

    // Search
    const search = () => {}

    // Fetch Data
    const fetchData = () => {
        
        dispatch( usersSlice.actions.setIsFetching(true) )

        ENDPOINTS.users().index()
        .then( (response: any) => {
            
            let users: user[] = []

            response.data?.users?.map( (item: any) => {
                users.push({
                    id: Number(item.id),
                    username: item.username,
                    email: item.email,
                    age: item.age,
                    gender: item.gender,
                    location: item.location
                })
            })

            dispatch( usersSlice.actions.add(users) )
            dispatch( usersSlice.actions.setIsLoaded(true) )
            dispatch( usersSlice.actions.setIsFetching(false) )
        })

    }

    interface tableDataType { [key: string]: { [key: string]: any } }
    const generateData: () => tableDataType = () => {
        let data: tableDataType = {}
        state.users.map( (item, index) => {
            data[item.id] = {
                username: item.username,
                email: item.email,
                age: item.age,
                gender: item.gender,
                location: item.location,
                actions: <div className="show-on-hover">
                            <i className="icon-edit" onClick={(e: React.MouseEvent<HTMLLIElement>) => edit(e, item.id) } />
                        </div>
            }
        })
        return data
    }

    // Edit
    const edit = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
        e.stopPropagation()
        let userToEdit = state.users.find(user => user.id === id)
        if(userToEdit) {
            dispatch( addUserSlice.actions.set(userToEdit) )
            dispatch( addUserSlice.actions.setEditId(userToEdit.id) )
            dispatch( addUserSlice.actions.setIsOpen(true) )
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
                    title={t("users")}
                    // search={search}
                    showFilter={false}
                    showDelete={selectedIds.length > 0}
                    // add={() => dispatch( adduserSlice.actions.setIsOpen(true) )}
                    addText={t("add_to_users")}
                    // delete={remove}
                    />
                
                <DashboardTable
                    header={[ t("full_name"), t("email"), t("age"), t("gender"), t("location"), "" ]}
                    body={generateData()}
                    onSelect={toggleSelectedId}
                    hasMore={state.hasMore}
                    loadMore={fetchData}
                    hideSelect={true}
                    />
                
                <AddUserModal />

            </> : <div className="center"><EllipsisLoader /></div> }
        </>
    )

}