import React from 'react';

export const UkFlag = ({ size = 16, style = {} }) => (
    <svg
        width={size}
        height={Math.round(size * 0.5)}
        viewBox="0 0 60 30"
        style={{ borderRadius: 2, display: "inline-block", verticalAlign: "middle", ...style }}
    >
        <clipPath id="s">
            <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
);
