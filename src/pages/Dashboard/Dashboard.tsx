import React from 'react'
import { useTranslation } from 'react-multi-lang'

// Components
import { SideNav, TopNav } from '../../components/Nav/Nav'

// Stylesheet
import './Dashboard.css'
import Notifications from '../../containers/Notifications/Notifications'
import DailyDuas from '../../containers/DailyDuas/DailyDuas'

export default (props: any) => {

    const t = useTranslation()

    const navList = [
        {
            icon: "icon-users",
            name: t("users"),
            link: "/users"
        },
        {
            icon: "icon-dua-hands",
            name: t("daily_duas"),
            link: "/daily-duas"
        },
        {
            icon: "icon-open-book",
            name: t("tidbits"),
            link: "/tidbits"
        },
        {
            icon: "icon-checklist",
            name: t("daily_checklist"),
            link: "/daily-checklist"
        },
        {
            icon: "icon-tasks",
            name: t("deed_of_the_day"),
            link: "/dotd"
        },
        {
            icon: "icon-notification",
            name: t("notifications"),
            link: "/notifications"
        }
    ]

    let section = props.match.params.section ? props.match.params.section.toLowerCase() : "analytics"
    
    const dashboardContent = () => {
        switch (section) {
            case "daily-duas":
                return(<DailyDuas />)
            case 'notifications':
                return(<Notifications />)
            default:
                break;
        }
    }

    return(
        <div className="dashboard-page">
            <SideNav list={navList} active={section} />
            <div className="main-side">

                <TopNav />

                <div className="content">
                    { dashboardContent() }
                </div>

            </div>
        </div>
    )
}