import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-multi-lang'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { tidbit, tidbitsSlice, tidbitsState } from './TidbitsSlice'
import { addTidbitSlice } from './AddModal/AddTidbitSlice'

// API
import API from '../../services/api/api'

// Components
import TableActionBar from '../../components/TableActionBar/TableActionBar'
import { DashboardTable } from '../../components/Table/Table'
import { EllipsisLoader, WhiteboxLoader } from '../../components/Loader/Loader'
import { SelectField } from '../../components/FormElements/FormElements'
import AddTidbitModal from './AddModal/AddTidbitModal'
import { formatDate } from '../../services/hoc/helpers'

export default () => {

    // Translation
    const t = useTranslation()

    // Redux
    const dispatch = useDispatch()
    const state = useSelector( ( state: { tidbits: tidbitsState } ) => state.tidbits )

    // API
    const ENDPOINTS = new API()

    // Search
    const search = () => {}

    // Fetch Data
    const fetchData = () => {
        
        dispatch( tidbitsSlice.actions.setIsFetching(true) )

        ENDPOINTS.deed_of_the_day().get()
        .then( (response: any) => {

            // Set deed of the day
            let deedOfTheDay = Number(response.data?.deedOfTheDay?.id)

            ENDPOINTS.tidbits().index()
            .then( (response: any) => {
                
                let tidbits: tidbit[] = []
    
                response.data?.tidbits?.map( (item: any) => {
                    tidbits.push({
                        id: Number(item.id),
                        textEnglish: String(item.textEnglish ? item.textEnglish : "N/A"),
                        textFrench: String(item.textFrench ? item.textFrench : "N/A"),
                        active: false
                    })
                })
    
                dispatch( tidbitsSlice.actions.add(tidbits) )
                setTimeout(() => {
                    dispatch( tidbitsSlice.actions.setActiveDeed({ id: deedOfTheDay }) )
                }, 50);
                dispatch( tidbitsSlice.actions.setIsLoaded(true) )
                dispatch( tidbitsSlice.actions.setIsFetching(false) )
            })

        })

    }

    interface tableDataType { [key: string]: { [key: string]: any } }
    const generateData: () => tableDataType = () => {
        let data: tableDataType = {}
        state.tidbits.map( (item, index) => {
            data[item.id] = {
                textEnglish: item.textEnglish,
                textFrench: item.textFrench,
                fixed: <i className={ "icon-open-book" + ( item.active ? " active" : "" ) } onClick={(e: React.MouseEvent<HTMLLIElement>) => setActiveDeed(e, item.id) } />,
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
        let tidbitToEdit = state.tidbits.find(tidbit => tidbit.id === id)
        if(tidbitToEdit) {
            dispatch( addTidbitSlice.actions.set({
                textEnglish: tidbitToEdit.textEnglish,
                textFrench: tidbitToEdit.textFrench
            }) )
            dispatch( addTidbitSlice.actions.setEditId(tidbitToEdit.id) )
            dispatch( addTidbitSlice.actions.setIsOpen(true) )
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
        
        dispatch( tidbitsSlice.actions.setIsLoading(true) )

        ENDPOINTS.tidbits().delete(id || 0)
        .then(() => {
            dispatch( tidbitsSlice.actions.setIsLoading(false) )
            dispatch( tidbitsSlice.actions.delete([id || 0]) )
            if(!id) setSelectedIds([])
        })

    }

    const setActiveDeed = (e: React.MouseEvent<HTMLLIElement>, id: number ) => {
        
        e.stopPropagation()

        dispatch( tidbitsSlice.actions.setActiveDeed({ id }) )
        ENDPOINTS.deed_of_the_day().set({ id, value: formatDate(new Date()) })

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
                    title={t("tidbits")}
                    // search={search}
                    showFilter={false}
                    showDelete={selectedIds.length > 0}
                    add={() => dispatch( addTidbitSlice.actions.setIsOpen(true) )}
                    addText={t("add_to_tidbits")}
                    delete={remove}
                    />
                
                <DashboardTable
                    header={[ t("text_english"), t("text_french"), t("deed_of_the_day"), "" ]}
                    body={generateData()}
                    onSelect={toggleSelectedId}
                    hasMore={state.hasMore}
                    loadMore={fetchData}
                    hideSelect={true}
                    />
                
                <AddTidbitModal />

            </> : <div className="center"><EllipsisLoader /></div> }
        </>
    )

}