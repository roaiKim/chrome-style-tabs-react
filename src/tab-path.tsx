import React from "react";

export const TabBackageSvg: React.FC<React.SVGProps<SVGSVGElement>> = () => {
    return (
        <svg style={{ opacity: 0 }} version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <symbol id="cst-geometry-left" viewBox="0 0 214 36">
                    <path d="M17 0h197v36H0v-2c4.5 0 9-3.5 9-8V8c0-4.5 3.5-8 8-8z" />
                </symbol>
                <symbol id="cst-geometry-right" viewBox="0 0 214 36">
                    <use xlinkHref="#cst-geometry-left" />
                </symbol>
                <clipPath id="crop">
                    <rect className="mask" width="100%" height="100%" x="0" />
                </clipPath>
            </defs>
            <svg width="52%" height="100%">
                <use xlinkHref="#cst-geometry-left" width="214" height="36" className="cst-geometry" />
            </svg>
            <g transform="scale(-1, 1)">
                <svg width="52%" height="100%" x="-100%" y="0">
                    <use xlinkHref="#cst-geometry-right" width="214" height="36" className="cst-geometry" />
                </svg>
            </g>
        </svg>
    );
};

export const PrevSvg: React.FC<React.SVGProps<SVGSVGElement>> = () => {
    return (
        <svg viewBox="64 64 896 896" focusable="false" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
        </svg>
    );
};

export const NextSvg: React.FC<React.SVGProps<SVGSVGElement>> = () => {
    return (
        <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
        </svg>
    );
};

export const CloseSvg: React.FC<React.SVGProps<SVGSVGElement>> = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8">
            <path stroke="rgba(0, 0, 0, .65)" strokeLinecap="square" strokeWidth="1.5" d="M0 0 L8 8 M8 0 L0 8"></path>
        </svg>
    );
};
