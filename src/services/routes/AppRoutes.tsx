import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import ScrollToTop from './ScrollToTop'
import Login from '../../pages/Login/Login'
import ResetPassword from '../../pages/ResetPassword/ResetPassword'
import Dashboard from '../../pages/Dashboard/Dashboard'
import { withCookies } from "react-cookie";

import '../../assets/css/responsive.css'

class AppRoutes extends Component<{cookies: any}> {

    constructor(props: any) {
        super(props)
        if(localStorage.getItem("lang"))
            document.body.classList.add(localStorage.getItem("lang") == 'ar' ? 'rtl' : 'ltr')
        if(localStorage.getItem("theme"))
            document.body.classList.add( String( localStorage.getItem("theme") ) )
    }
    
    render() {
        return(
            <Router basename="/">
                <ScrollToTop>
                    { ( !this.props.cookies.get("token") || !this.props.cookies.get("refresh_token") ) ?
                    
                    // Auth pages
                    <Switch>
                        <Route exact path="/" component={Login} />
                        <Route exact path="/reset-password/:token" component={ResetPassword} />
                        <Route path="/" component={() => <Redirect to="/" />} />
                    </Switch> :

                    // Dashboard pages
                    <Switch>
                        <Route path="/:section" component={Dashboard} />
                        <Route path="/" component={Dashboard} />
                    </Switch> }
                </ScrollToTop>
            </Router>
        )
    }
}

export default withCookies(AppRoutes)