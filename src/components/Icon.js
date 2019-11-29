import React from 'react';

export default function Icon(props) {
    let icon;

    if (props.name === 'indicator') {
        icon = (
            <svg>
                <g id="🎨-Styleguide" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="mobile---XS-(&lt;-576px)-Input-Forms" transform="translate(-335.000000, -1475.000000)">
                        <g id="outline-arrow_forward_ios-24px"
                           transform="translate(345.000000, 1480.000000) rotate(90.000000) translate(-345.000000, -1480.000000) translate(335.000000, 1470.000000)">
                            <polygon id="Shape" opacity="0.87"
                                     points="20 20 -3.55271368e-15 20 -3.55271368e-15 0 20 0"></polygon>
                            <polyline id="Path-2" stroke="#000000" points="6 20 14.75 10.0048797 6 0"></polyline>
                        </g>
                    </g>
                </g>
            </svg>
        )
    }

    return <div className={`icon icon--${props.name}`}>
        {icon}
    </div>
}