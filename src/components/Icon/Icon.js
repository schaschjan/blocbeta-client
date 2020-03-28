import React from 'react';
import './Icon.css';
import classnames from "classnames";

const Icon = ({name, onClick, className, fill, ...rest}) => {

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

    if (name === 'resignation') {
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

    if (name === 'todo') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <circle cx="12" cy="12" r="5.5" stroke="#FFCB41"/>
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

    if (name === 'open-filters') {
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

    if (name === 'close-filters') {
        size = 'large';
        icon = (
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H50V50H0V0Z" fill="white" fill-opacity="0.01"/>
                <path d="M13.48 36.52L36.52 13.48" stroke="black" stroke-linecap="round"/>
                <path d="M36.52 36.52L13.48 13.48" stroke="black" stroke-linecap="round"/>
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

    if (name === 'female') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M15.183 13.0604C14.4317 13.8117 13.4808 14.2418 12.501 14.3507L12.501 16H15V17H12.501L12.501 19.5H11.501V17H9V16H11.501V14.3507C10.5212 14.2418 9.5703 13.8117 8.819 13.0604C7.06164 11.303 7.06164 8.45375 8.819 6.69639C10.5764 4.93903 13.4256 4.93903 15.183 6.69639C16.9403 8.45375 16.9403 11.303 15.183 13.0604ZM9.5261 12.3532C10.8929 13.7201 13.109 13.7201 14.4759 12.3532C15.8427 10.9864 15.8427 8.77033 14.4759 7.4035C13.109 6.03666 10.8929 6.03666 9.5261 7.4035C8.15927 8.77033 8.15927 10.9864 9.5261 12.3532Z"
                      fill="#333333"/>
            </svg>
        )
    }

    if (name === 'male') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H24V24H0V0Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M10.5 9.00195C11.5625 9.00195 12.539 9.37019 13.3088 9.986L16.2948 7H14V6H17H17.2948L17.2949 5.99996L17.2949 6H18V6.70508L18.002 6.70707L18 6.70906V7V10H17V7.70906L14.016 10.6931C14.6318 11.4629 15 12.4394 15 13.502C15 15.9872 12.9853 18.002 10.5 18.002C8.01472 18.002 6 15.9872 6 13.502C6 11.0167 8.01472 9.00195 10.5 9.00195ZM14 13.502C14 11.569 12.433 10.002 10.5 10.002C8.567 10.002 7 11.569 7 13.502C7 15.4349 8.567 17.002 10.5 17.002C12.433 17.002 14 15.4349 14 13.502Z"
                      fill="#333333"/>
            </svg>
        )
    }

    if (name === 'avatar') {
        size = 'small';
        icon = (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M11 21C16.5228 21 21 16.5228 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 16.5228 5.47715 21 11 21Z"
                      stroke="#9CA7E7"/>
                <path d="M5 8C5 9 6 9.5 7 9.5C8 9.5 9 9 9 8L8.5 13L11 13" stroke="#9CA7E7" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M17 8C17 9 16 9.5 15 9.5C14 9.5 13 9 13 8" stroke="#9CA7E7" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path d="M16.9999 12C16.9999 13.9968 15.5012 18 10.9856 18C9.34622 18 8.10824 17.4703 7.19629 16.7008"
                      stroke="#9CA7E7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    return <span className={classnames("icon", `icon--${size}`, onClick ? 'icon--clickable' : null, className)}
                 onClick={onClick}
                 {...rest}>
        {icon}
    </span>
};

export default Icon;