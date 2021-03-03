import './Loader.css'

export const RippleLoader = () => {
    return(
        <div className="lds-ripple"><div></div><div></div></div>
    )
}

export const EllipsisLoader = () => (
    <div className="lds-ellipsis"><div /><div /><div /><div /></div>
)

export const WhiteboxLoader = () => (
    <div className="whitebox-loader">
        <div className="center">
            <EllipsisLoader />
        </div>
    </div>
)

export const SuccessMark = () => {
    return (
        <div className="success-holder">
            <div className="success-checkmark">
                <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                </div>
            </div>
        </div>
    )
}