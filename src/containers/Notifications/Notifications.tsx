import React, { useState } from 'react'

// Translation
import { useTranslation } from 'react-multi-lang'

// Stylesheet
import './Notifications.css'

// Assets
import notifications from '../../assets/images/vector/notifications.svg'

// Components
import { Textarea } from '../../components/FormElements/FormElements'

export default () => {

    // Translation
    const t = useTranslation()

    // React Hooks
    const [notification, setNotification] = useState<string>("")

    const sendNotification = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

    }

    return(
        <div className="notifications">
            <img src={notifications} />
            <form className="margin-top-30" onSubmit={sendNotification}>
                <Textarea
                    value={notification}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotification(e.target.value)}
                    placeholder={t("notification_text")}
                    rows={5} />
                <button className="button bg-gold color-white round margin-top-20" style={{ padding: "0 50px" }}>{t("send_notification")}</button>
            </form>
        </div>
    )

} 