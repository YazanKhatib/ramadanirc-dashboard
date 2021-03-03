import React, { useState } from 'react'
import { uid } from '../../services/hoc/helpers'

import './Alerts.css'

interface StaticAlertProps {
    show: boolean,
    type: "warning" | "error" | "success" | "info",
    children?: any
}

export const StaticAlert = (props: StaticAlertProps) => {

    const [dasharray, setDasharray] = useState<number>(0)
    const id = uid("alert")

    return(
        <>
        {props.show ?
        <div className={"alert " + props.type }>
            <div className="alert-content">
                {props.children}
            </div>
        </div> : ""
        }
        </>
    )

}