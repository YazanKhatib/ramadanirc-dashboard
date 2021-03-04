import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { task, checklistSlice, checklistState } from './DailyChecklistSlice'
import { addTaskSlice } from './AddModal/AddTaskSlice'

// API
import API from '../../services/api/api'

// Components
import TableActionBar from '../../components/TableActionBar/TableActionBar'
import { DashboardTable } from '../../components/Table/Table'
import { EllipsisLoader, WhiteboxLoader } from '../../components/Loader/Loader'
import { SelectField } from '../../components/FormElements/FormElements'
import AddTaskModal from './AddModal/AddTaskModal'

export default () => {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { checklist: checklistState } ) => state.checklist )

    // API
    const ENDPOINTS = new API()

    // Search
    const search = () => {}

    // Fetch Data
    const fetchData = () => {
        
        dispatch( checklistSlice.actions.setIsFetching(true) )

        ENDPOINTS.checklist().index()
        .then( (response: any) => {
            
            let checklist: task[] = []

            response.data?.tasks?.map( (item: any) => {
                checklist.push({
                    id: Number(item.id),
                    name: String(item.name ? item.name : "N/A"),
                    fixed: Boolean(item.fixed)
                })
            })

            dispatch( checklistSlice.actions.add(checklist) )
            dispatch( checklistSlice.actions.setIsLoaded(true) )
            dispatch( checklistSlice.actions.setIsFetching(false) )
        })

    }

    interface tableDataType { [key: string]: { [key: string]: any } }
    const generateData: () => tableDataType = () => {
        let data: tableDataType = {}
        state.checklist.map( (item, index) => {
            data[item.id] = {
                name: item.name,
                fixed: <i className={ "icon-pin" + ( item.fixed ? "" : "-outline" ) } onClick={(e: React.MouseEvent<HTMLLIElement>) => toggleFixed(e, item.id, item.fixed) } />,
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
        let taskToEdit = state.checklist.find(task => task.id === id)
        if(taskToEdit) {
            dispatch( addTaskSlice.actions.set({
                name: taskToEdit.name
            }) )
            dispatch( addTaskSlice.actions.setEditId(taskToEdit.id) )
            dispatch( addTaskSlice.actions.setIsOpen(true) )
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
        
        dispatch( checklistSlice.actions.setIsLoading(true) )

        ENDPOINTS.checklist().delete(id || 0)
        .then(() => {
            dispatch( checklistSlice.actions.setIsLoading(false) )
            dispatch( checklistSlice.actions.delete([id || 0]) )
            if(!id) setSelectedIds([])
        })

    }

    const toggleFixed = (e: React.MouseEvent<HTMLLIElement>, id: number, fixed: boolean) => {
        
        e.stopPropagation()

        dispatch( checklistSlice.actions.toggleFixed({ id, fixed: !fixed }) )
        ENDPOINTS.checklist().update({ id, fixed: !fixed })

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
                    title={t("checklist")}
                    // search={search}
                    showFilter={false}
                    showDelete={selectedIds.length > 0}
                    add={() => dispatch( addTaskSlice.actions.setIsOpen(true) )}
                    addText={t("add_to_tasks")}
                    delete={remove}
                    />
                
                <DashboardTable
                    header={[ t("name"), t("fixed"), "" ]}
                    body={generateData()}
                    onSelect={toggleSelectedId}
                    hasMore={state.hasMore}
                    loadMore={fetchData}
                    hideSelect={true}
                    />
                
                <AddTaskModal />

            </> : <div className="center"><EllipsisLoader /></div> }
        </>
    )

}