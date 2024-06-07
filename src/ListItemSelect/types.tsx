import * as React from 'react';

export type ListItemSelectSizes = 'small' | 'medium';

export interface ListItemSelectProps {
    /** Changing text size */
    size?: ListItemSelectSizes;

    /** Applied as data-hook HTML attribute that can be used in the tests */
    dataHook?: string;

    /** A css class to be applied to the component's root element */
    className?: string;

    /** Title of the list item */
    title?: React.ReactNode;

    /** Any suffix */
    suffix?: React.ReactNode;

    /** If true, long text won't break into more than one line and will be terminated with an ellipsis */
    ellipsis?: boolean;

    /** If true, a checkbox will be shown */
    checkbox?: boolean;

    /** Any prefix */
    prefix?: React.ReactNode;

    /** Text of the list item subtitle */
    subtitle?: React.ReactNode;

    /** If true, the item is selected */
    selected?: boolean;

    /** If true, the item is disabled */
    disabled?: boolean;

    /** If true, the item is highlighted */
    highlighted?: boolean;

    /** Callback function triggered when list item is clicked */
    onClick?: React.MouseEventHandler<HTMLElement>;
}
