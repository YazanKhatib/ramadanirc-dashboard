// Libraries
import ReactTooltip from 'react-tooltip';
import { Icon } from "@iconify/react";
import sunIcon from '@iconify-icons/feather/sun';
import moonIcon from '@iconify-icons/feather/moon';
import Select from 'react-select'

// Helpers
import { uid } from '../../services/hoc/helpers';

// Stylesheet
import './FormElements.css'
import { setLanguage } from 'react-multi-lang';

export const InputField = (props: any) => {

    let field: object = (({ type, onChange, defaultValue, disabled, max, min, value }) => ({ type, onChange, defaultValue, disabled, max, min, value }))(props);
    let inputLabel: string = props.placeholder ? props.placeholder : props.label ? props.label : '';
    let id = uid('input')

    return (
        <div className="input-box">
            <input {...field} autoComplete="" id={id} />
            { inputLabel ? <label className={props.value ? "active" : ''} htmlFor={id}>{inputLabel}</label> : ''}
            {props.error ? <i className="icon-error" data-tip={props.error}></i> : ''}
            {props.error ? <ReactTooltip place="left" type="error" effect="solid" delayHide={500} /> : ''}
        </div>
    )

}

export const Textarea = (props: any) => {
    let field: object = (({ onChange, defaultValue, disabled, value, rows }) => ({ onChange, defaultValue, disabled, value, rows }))(props);
    let inputLabel: string = props.placeholder ? props.placeholder : props.label ? props.label : '';
    let id = uid('input')

    return (
        <div className="input-box textarea-box">
            <textarea {...field} id={id} />
            { inputLabel ? <label className={props.value ? "active" : ''} htmlFor={id}>{inputLabel}</label> : ''}
            {props.error ? <i className="icon-error" data-tip={props.error}></i> : ''}
            {props.error ? <ReactTooltip place="left" type="error" effect="solid" delayHide={500} /> : ''}
        </div>
    )
}

export const Checkbox = (props: any) => {

    let field: object = (({ onChange, disabled, checked }) => ({ onChange, disabled, checked }))(props);
    let inputLabel: string = props.label;
    let id = uid('input')

    return (
        <div className="checkbox">
            <input {...field} type="checkbox" id={id} />
            <div>
                {inputLabel ? <label className={props.value ? "active" : ''} htmlFor={id}><i className="icon-checkmark" />{inputLabel}</label> : ''}
            </div>
        </div>
    )

}


export const SimpleCheckbox = (props: any) => {
    
    let field: object = (({ onChange, onClick, disabled, checked, className }) => ({ onChange, onClick, disabled, checked, className }))(props);
    let id = uid('input')

    return(
        <div className="simple-checkbox">
            <input type="checkbox" id={id} {...field} />
            <label htmlFor={id} ><i className="icon-checkmark" /></label>
        </div>
    )

}


export const LightDarkModeSwitcher = (props: any) => {

    const changeMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) {
            document.body.classList.add('dark')
            localStorage.setItem("theme", 'dark')
        }
        else {
            document.body.classList.remove('dark')
            localStorage.setItem("theme", 'light')
        }
    }

    return (
        <label style={{ display: 'inline-block', cursor: 'pointer' }}>
            <input className='toggle-checkbox' type='checkbox' onChange={changeMode} defaultChecked={ localStorage.getItem("theme") ? localStorage.getItem("theme") === 'dark' : false }></input>
            <div className='toggle-slot'>
                <div className='sun-icon-wrapper'>
                    <Icon icon={sunIcon} className="sun-icon" />
                </div>
                <div className='toggle-button'></div>
                <div className='moon-icon-wrapper'>
                    <Icon icon={moonIcon} className="moon-icon" />
                </div>
            </div>
        </label>
    )

}


export const LanguageSwitcher = (props: any) => {
    const changeLang = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.checked) {
            setLanguage('fr')
            // document.body.classList.add('rtl')
            localStorage.setItem("lang", "fr")
        }
        else {
            setLanguage('en')
            // document.body.classList.remove('rtl')
            localStorage.setItem("lang", "en")
        }
    }

    return (
        <label style={{ display: 'inline-block', cursor: 'pointer' }} className="language-toggle">
            <input className='toggle-checkbox' type='checkbox' onChange={changeLang} defaultChecked={ localStorage.getItem("lang") ? localStorage.getItem("lang") === 'fr' : false }></input>
            <div className='toggle-slot'>
                <div className="fr">Fr</div>
                <div className='toggle-button'></div>
                <div className="en">En</div>
            </div>
        </label>
    )

}


export const SelectField = (props: any) => {

    return(
        <div className="select-holder">
            <Select {...props} className="react-select" classNamePrefix="react-select"  />
            {props.error ? <i className="icon-error" data-tip={props.error}></i> : ''}
            {props.error ? <ReactTooltip place="left" type="error" effect="solid" delayHide={500} /> : ''}
        </div>
    )

}