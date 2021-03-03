import ResetPasswordForm from "../../containers/ResetPasswordForm/ResetPasswordForm"

// Redux
import { useSelector } from "react-redux"
import { resetPasswordState } from "../../containers/ResetPasswordForm/ResetPasswordFormSlice"

import Logo from '../../assets/images/logo/primary.svg'
import { LanguageSwitcher, LightDarkModeSwitcher } from "../../components/FormElements/FormElements"

export default () => {

    const resetPasswordState = useSelector((state: { reset_password: resetPasswordState }) => state.reset_password)

    return(
        <div className="login-page">
            
            <div className="layout">

                <div className="form-holder">
                    
                    { resetPasswordState.isSuccess ? "" : <div className="text-center"><img src={Logo} className="logo" /></div> }

                    <ResetPasswordForm />

                </div>

                <div className="switch-actions">
                    <LightDarkModeSwitcher />
                    <LanguageSwitcher />
                </div>

            </div>
            
        </div>
    )
}