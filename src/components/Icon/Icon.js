import React from 'react';
import './Icon.css';
import classnames from "classnames";

const Icon = ({name, onClick, fill, ...rest}) => {

    let icon;
    let size;

    if (name === 'search') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18.1136 17.4064C18.3088 17.6017 18.3088 17.9183 18.1136 18.1136C17.9183 18.3088 17.6017 18.3088 17.4065 18.1136L18.1136 17.4064ZM17.4065 18.1136L12.8965 13.6036L13.6036 12.8964L18.1136 17.4064L17.4065 18.1136Z"
                    fill="black"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M10.4 14.8C12.8301 14.8 14.8 12.8301 14.8 10.4C14.8 7.96995 12.8301 6 10.4 6C7.96995 6 6 7.96995 6 10.4C6 12.8301 7.96995 14.8 10.4 14.8Z"
                      stroke="black"/>
            </svg>
        )
    }

    if (name === 'flash') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <path
                    d="M12 5.29291L7.64648 9.64646L8.35359 10.3536L11.5 7.20712V18H12.5V7.20712L15.6465 10.3536L16.3536 9.64646L12 5.29291Z"
                    fill={fill ? fill : "#1687FF"}/>
            </svg>

        )
    }

    if (name === 'top') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <path
                    d="M9.23503 17.4628L8.99348 17.7044L4 12.7109L4.70711 12.0038L8.99628 16.2929L19.2892 6L19.9963 6.70711L9.23782 17.4656L9.23503 17.4628Z"
                    fill={fill ? fill : "#02DEAF"}/>
            </svg>
        )
    }

    if (name === 'resign') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <path
                    d="M11.295 12.0021L6 17.2971L6.70711 18.0042L12.0021 12.7092L17.2972 18.0042L18.0043 17.2971L12.7092 12.0021L18.0042 6.70711L17.2971 6L12.0021 11.295L6.70715 6.00001L6.00005 6.70711L11.295 12.0021Z"
                    fill={fill ? fill : "#FF5D5F"}/>
            </svg>
        )
    }

    if (name === 'close') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.7069 12.0001L17.8536 6.85334C18.0488 6.65808 18.0488 6.34172 17.8536 6.14645C17.6583 5.95118 17.3419 5.95118 17.1456 6.14645L12 11.2932L6.85332 6.14645C6.65806 5.95118 6.34171 5.95118 6.14645 6.14645C5.95118 6.34172 5.95118 6.65808 6.14645 6.85334L11.2931 12.0001L6.14645 17.1469C5.95118 17.3422 5.95118 17.6586 6.14645 17.8538C6.24463 17.9509 6.37226 18 6.49989 18C6.62752 18 6.75624 17.9509 6.85332 17.8538L12 12.707L17.1456 17.8538C17.2438 17.9509 17.3714 18 17.5001 18C17.6277 18 17.7554 17.9509 17.8536 17.8538C18.0488 17.6586 18.0488 17.3422 17.8536 17.1469L12.7069 12.0001Z"
                      fill="#333333"/>
            </svg>

        )
    }

    if (name === 'forward') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 -1 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M9 7L15 12.1025L9 17" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'downward') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M7 9L12.1025 15L17 9" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'backward') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M15 7L9 12.1025L15 17" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'filtermenu') {
        size = 'large';
        icon = (
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H50V50H0V0Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H50V50H0V0Z" fill="white" fill-opacity="0.01"/>
                <circle cx="25" cy="17" r="2" fill="#333333"/>
                <circle cx="25" cy="25" r="2" fill="#333333"/>
                <circle cx="25" cy="33" r="2" fill="#333333"/>
            </svg>
        )
    }

    if (name === 'error') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#FF0000"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11.27 7H13.19L12.98 13.675H11.465L11.27 7ZM11.345 16.765C11.115 16.545 11 16.265 11 15.925C11 15.585 11.115 15.3 11.345 15.07C11.575 14.84 11.87 14.725 12.23 14.725C12.59 14.725 12.89 14.84 13.13 15.07C13.37 15.3 13.49 15.585 13.49 15.925C13.49 16.265 13.37 16.545 13.13 16.765C12.89 16.985 12.59 17.095 12.23 17.095C11.87 17.095 11.575 16.985 11.345 16.765Z"
                      fill="#FF0000"/>
            </svg>
        )
    }

    if (name === 'up') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M7 15L12.1025 9L17 15" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'down') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M7 9L12.1025 15L17 9" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'small') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M12.7069 12.0001L17.8536 6.85334C18.0488 6.65808 18.0488 6.34172 17.8536 6.14645C17.6583 5.95118 17.3419 5.95118 17.1456 6.14645L12 11.2932L6.85332 6.14645C6.65806 5.95118 6.34171 5.95118 6.14645 6.14645C5.95118 6.34172 5.95118 6.65808 6.14645 6.85334L11.2931 12.0001L6.14645 17.1469C5.95118 17.3422 5.95118 17.6586 6.14645 17.8538C6.24463 17.9509 6.37226 18 6.49989 18C6.62752 18 6.75624 17.9509 6.85332 17.8538L12 12.707L17.1456 17.8538C17.2438 17.9509 17.3714 18 17.5001 18C17.6277 18 17.7554 17.9509 17.8536 17.8538C18.0488 17.6586 18.0488 17.3422 17.8536 17.1469L12.7069 12.0001Z"
                      fill="#333333"/>
            </svg>
        )
    }

    return <span className={classnames("icon", `icon--${size}`, onClick ? 'icon--clickable' : null)}
                 onClick={onClick}
                 {...rest}>{icon}</span>
};

export default Icon;