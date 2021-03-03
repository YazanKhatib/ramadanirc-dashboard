import React from 'react'

// Infinite Scroll
import InfiniteScroll from 'react-infinite-scroller';

// Stylesheet
import './Table.css'

// Components
import { SimpleCheckbox } from '../FormElements/FormElements'
import { EllipsisLoader } from '../Loader/Loader';

interface DashboardTableProps {
    header: string[], // Table header data
    body: {
        [key: string]: { [key: string]: any } // Cells
    }, // Rows
    onSelect?: Function, // Fire this function when the user selects a raw,
    hasMore?: boolean,
    loadMore?: Function,
    hideSelect?: boolean
}

export const DashboardTable = (props: DashboardTableProps) => {

    const selectRow = (e: React.MouseEvent<HTMLTableRowElement>, id?: string) => {
        // Toggle active class
        e.currentTarget.classList.toggle("active")

        // Toggle checkbox
        let checkbox: HTMLInputElement | null = e.currentTarget.querySelector("input[type='checkbox']")
        checkbox?.click()

        // Fire select function
        if( props.onSelect && id )
            props.onSelect(id)
    }

    return (
        <div className="dashboard-table">
            <table>
                <thead>
                    <tr>
                        { props.hideSelect ? "" : <th></th> }
                        {props.header.map((item, index) => (
                            <th style={item ? {} : {width: "200px"}} key={index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <InfiniteScroll
                    element="tbody"
                    pageStart={1}
                    hasMore={props.hasMore}
                    loader={<tr className="table-loader" key={0}><div className="center"><EllipsisLoader /></div></tr>}
                    loadMore={(page: number) => {
                        if(props.loadMore)
                            props.loadMore(page)
                    }}>
                { Object.keys(props.body).map( ( id, tr_index ) => (
                    <tr key={id} style={{ zIndex: Object.keys(props.body).length - tr_index }} onClick={(e: React.MouseEvent<HTMLTableRowElement>) => selectRow(e, id) }>
                        { props.hideSelect ? "" : <td width="50"><SimpleCheckbox className="select-row" onClick={(e: React.MouseEvent<HTMLTableDataCellElement>) => e.stopPropagation()} /></td> }
                        { Object.keys(props.body[id]).map( ( key, td_index ) => (
                            <td key={tr_index + "_" + td_index}>{props.body[id][key]}</td>
                        ) ) }
                    </tr>
                ) ) }
                </InfiniteScroll>
            </table>
        </div>
    )

}