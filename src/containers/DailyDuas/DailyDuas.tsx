import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { dua, duasSlice, duasState } from './DailyDuasSlice'
import { addDuaSlice } from './AddModal/AddDuaSlice'

// API
import API from '../../services/api/api'

// Components
import TableActionBar from '../../components/TableActionBar/TableActionBar'
import { DashboardTable } from '../../components/Table/Table'
import { EllipsisLoader, WhiteboxLoader } from '../../components/Loader/Loader'
import { SelectField } from '../../components/FormElements/FormElements'
import AddDuaModal from './AddModal/AddDuaModal'

export default () => {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { duas: duasState } ) => state.duas )

    // API
    const ENDPOINTS = new API()

    // Search
    const search = () => {}

    // Fetch Data
    const fetchData = () => {
        
        dispatch( duasSlice.actions.setIsFetching(true) )

        ENDPOINTS.duas().index()
        .then( (response: any) => {
            
            let duas: dua[] = []

            response.data?.duas?.map( (item: any) => {
                duas.push({
                    id: Number(item.id),
                    arabic: String(item.textArabic ? item.textArabic : "N/A"),
                    english: String(item.textEnglish ? item.textEnglish : "N/A"),
                    inbetween: String(item.textInbetween ? item.textInbetween : "N/A"),
                })
            })

            dispatch( duasSlice.actions.add(duas) )
            dispatch( duasSlice.actions.setIsLoaded(true) )
            dispatch( duasSlice.actions.setIsFetching(false) )
        })

    }

    interface tableDataType { [key: string]: { [key: string]: any } }
    const generateData: () => tableDataType = () => {
        let data: tableDataType = {}
        state.duas.map( (item, index) => {
            data[item.id] = {
                dua_arabic: <span style={{ display: "block", textAlign: "right" }}>{item.arabic}</span>,
                dua_english: item.english,
                dua_in_between: item.inbetween,
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
        let duaToEdit = state.duas.find(dua => dua.id === id)
        if(duaToEdit) {
            dispatch( addDuaSlice.actions.set({
                textArabic: duaToEdit.arabic,
                textEnglish: duaToEdit.english,
                textInbetween: duaToEdit.inbetween,
            }) )
            dispatch( addDuaSlice.actions.setEditId(duaToEdit.id) )
            dispatch( addDuaSlice.actions.setIsOpen(true) )
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
        
        dispatch( duasSlice.actions.setIsLoading(true) )

        ENDPOINTS.duas().delete(id || 0)
        .then(() => {
            dispatch( duasSlice.actions.setIsLoading(false) )
            dispatch( duasSlice.actions.delete([id || 0]) )
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
                    title={t("duas")}
                    // search={search}
                    showFilter={false}
                    showDelete={selectedIds.length > 0}
                    add={() => dispatch( addDuaSlice.actions.setIsOpen(true) )}
                    addText={t("add_to_duas")}
                    delete={remove}
                    />
                
                <DashboardTable
                    header={[ t("dua_arabic"), t("dua_english"), t("dua_in_between"), "" ]}
                    body={generateData()}
                    onSelect={toggleSelectedId}
                    hasMore={state.hasMore}
                    loadMore={fetchData}
                    hideSelect={true}
                    />
                
                <AddDuaModal />

            </> : <div className="center"><EllipsisLoader /></div> }
        </>
    )

}