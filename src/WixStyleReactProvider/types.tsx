import * as React from 'react';

export type Features = {
    newColorsBranding?: boolean;
    sidebarExperimentCollapsible?: boolean;
};

export interface WixStyleReactProviderProps {
    /** Applied as data-hook HTML attribute that can be used to create driver in testing */
    dataHook?: string;

    /** A css class to be applied to the component's root element */
    className?: string;

    /** render as some other component or DOM tag */
    as?: 'span' | 'div';

    /** A renderable node */
    children?: React.ReactNode;

    /** Object which represent all features you would like to use. The available features are:
     * - `newColorsBranding`: new business dashboard colors
     * - `sidebarExperimentCollapsible`: sidebar component experiment to enable collapsible feature.
     * */
    features?: Features;

    typographyClass?: string;
}
