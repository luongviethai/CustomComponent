import type * as React from 'react';

export interface LoaderProps {
    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook?: string;

    /** The size of the loader */
    size?: LoaderSize;

    /** The color of the loader */
    color?: LoaderColor;

    /** Node (usually text) to be shown below the loader */
    text?: React.ReactNode;

    /** The status of the loader */
    status?: LoaderStatus;

    /** Text to be shown in the tooltip * */
    statusMessage?: string;

    className?: string;
}

export type LoaderSize = 'tiny' | 'small' | 'medium' | 'large';

export type LoaderColor = 'blue' | 'white';

export type LoaderStatus = 'loading' | 'success' | 'error';
