import React, { useState } from 'react'
import { Link, Redirect, useLocation } from 'react-router-dom'

// Custom scrollbar
import { Scrollbars } from 'react-custom-scrollbars';

// Stylesheet
import './Nav.css'

// Assets
import Logo from '../../assets/images/logo/primary.svg'
import { LanguageSwitcher, LightDarkModeSwitcher } from '../FormElements/FormElements'
import { useCookies } from 'react-cookie'

interface NavProps {
    list: {
        icon: string,
        name: string,
        link: string
    }[],
    active: string | null
}

export const SideNav = (props: NavProps) => {


    const getActiveIndexByName = (name: string | null): number => {
        let matched_index = 0
        props.list.map((item, index) => {
            if (item.link.substring(1) === name)
                matched_index = index
        })
        return matched_index
    }

    const getActiveBoxPositionByIndex = (index: number): number => {
        // return index === 0 ? index * 90 : index === props.list.length - 1 ? index * 90 + 10 : index * 90 + 5
        return index * 90
    }

    const [activeBox, setActiveBox] = useState<number>(getActiveBoxPositionByIndex(getActiveIndexByName(props.active)))

    return (
        <nav className="side-nav">
            <Scrollbars
                autoHeight
                autoHeightMin="75vh"
                autoHide
                renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>} >
                <div className="active-box" style={{ top: activeBox }} />
                <ul>
                    {props.list.map((item, index) => {
                        return (
                            <li key={index} className={item.link.substring(1) === props.active ? "active" : ""} onClick={() => setActiveBox(getActiveBoxPositionByIndex(index))}><Link to={item.link}><span><i className={item.icon}></i> {item.name}</span></Link></li>
                        )
                    })}
                </ul>
            </Scrollbars>
        </nav>
    )
}

export const TopNav = () => {

    // React hooks
    const [redirect, setRedirect] = useState<boolean>(false);

    // Cookies hooks
    const [_, __, removeCookie] = useCookies(['userinfo']);

    const logout = () => {
        setRedirect(true)
        removeCookie("userinfo")
        removeCookie("token")
        removeCookie("refresh_token")
    }

    return (
        <nav className="top-nav">
            <img src={Logo} className="logo" />

            <div className="actions">

                <div className="switchers">
                    <LightDarkModeSwitcher />
                    <span className="margin-10" />
                    <LanguageSwitcher />
                </div>

                <i className="icon-logout" onClick={logout} />

            </div>

            { redirect ? <Redirect to='/'/> : '' }

        </nav>
    )

}