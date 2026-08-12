'use client';

import React from 'react';

const InfinityLoader: React.FC = () => {
    return (
        <section className="flex justify-center items-center p-10 rounded-lg">
            <svg
                className="w-52 h-52"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8"
                    fill="none"
                    stroke="#1d2628"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>
                <path
                    id="loading-path"
                    d="M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8"
                    fill="none"
                    stroke="#ff0088"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={1}
                    pathLength={1}
                    strokeDasharray="0.25px 0.75px"
                    strokeDashoffset={-0.114}
                ></path>
            </svg>
        </section>
    );
};

export default InfinityLoader;
