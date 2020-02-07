import React from 'react';
import './Icon.css';
import classnames from "classnames";

const Icon = ({name}) => {

    let icon;
    let size;

    if (name === 'search') {
        size = 'small';
        icon =(
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.1136 17.4064C18.3088 17.6017 18.3088 17.9183 18.1136 18.1136C17.9183 18.3088 17.6017 18.3088 17.4065 18.1136L18.1136 17.4064ZM17.4065 18.1136L12.8965 13.6036L13.6036 12.8964L18.1136 17.4064L17.4065 18.1136Z" fill="black"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4 14.8C12.8301 14.8 14.8 12.8301 14.8 10.4C14.8 7.96995 12.8301 6 10.4 6C7.96995 6 6 7.96995 6 10.4C6 12.8301 7.96995 14.8 10.4 14.8Z" stroke="black"/>
            </svg>
        )
    }

    if (name === 'flash') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M16.8655 11.1036C16.7545 10.9706 16.6005 10.9306 16.4565 10.9636H7.5645L12.8055 5.05572C12.9845 4.84172 12.9845 4.49572 12.8055 4.28172C12.6265 4.06772 12.3365 4.06772 12.1565 4.28172L6.1345 11.1226C6.0915 11.1736 6.0585 11.2346 6.0345 11.3016C5.9885 11.4346 5.9885 11.5856 6.0345 11.7196C6.0815 11.8536 6.1705 11.9596 6.2825 12.0156C6.3385 12.0426 6.3985 12.0576 6.4575 12.0576H15.4185L9.5455 18.0666C9.3665 18.2806 9.3665 18.6266 9.5455 18.8406C9.6355 18.9466 9.7525 19.0006 9.8695 19.0006C9.9865 19.0006 10.1045 18.9466 10.1935 18.8406L16.8145 11.9386C16.9245 11.8386 17.0005 11.6886 17.0005 11.5106C17.0005 11.3576 16.9575 11.2136 16.8655 11.1036Z"
                      fill="#333333"/>
            </svg>
        )
    }

    if (name === 'top') {
        size = 'small';
        icon = (
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M20.1695 6.13425L9.8165 15.8933L4.8295 11.1922C4.6405 11.0132 4.3325 11.0132 4.1425 11.1922C3.9525 11.3712 3.9525 11.6613 4.1425 11.8403L9.4735 16.8652C9.5685 16.9552 9.6925 17.0002 9.8165 17.0002C9.9415 17.0002 10.0655 16.9552 10.1605 16.8652L20.8575 6.78225C21.0475 6.60325 21.0475 6.31325 20.8575 6.13425C20.6675 5.95525 20.3595 5.95525 20.1695 6.13425Z"
                      fill="#333333"/>
            </svg>

        )
    }

    if (name === 'resign') {
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

    if (name === 'back') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M15 7L9 12.1025L15 17" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }

    if (name === 'forward') {
        size = 'small';
        icon = (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" fill="white" fill-opacity="0.01"/>
                <path d="M9 7L15 12.1025L9 17" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
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

    return <span className={classnames("icon", `icon--${size}`)}>{icon}</span>
};

export default Icon;