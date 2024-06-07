import * as React from 'react';
import { IconElement, OmitPolyfill } from '../common';
import { EllipsisCommonProps } from '../common/Ellipsis';

export type ListItemActionWithAsProp<T> =
    | ListItemActionAsButtonProps<T>
    | ListItemActionAsAnchorProps<T>
    | ListItemActionGenericProps<T>
    | ListItemActionAsComponentProps<T>;

type ListItemActionAsButtonProps<T> = React.ButtonHTMLAttributes<HTMLButtonElement> &
    T & {
        as?: 'button';
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
    };

type ListItemActionAsAnchorProps<T> = React.AnchorHTMLAttributes<HTMLAnchorElement> &
    T & {
        as: 'a';
        onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    };

type ListItemActionGenericProps<T> = T & {
    /** render as some other element */
    as: keyof OmitPolyfill<HTMLElementTagNameMap, 'a' | 'button'>;
    onClick?: React.MouseEventHandler<HTMLElement>;
    [additionalProps: string]: any;
};

type ListItemActionAsComponentProps<T> = T & {
    as: React.ComponentType<any>;
    onClick?: React.MouseEventHandler<HTMLElement>;
    [additionalProps: string]: any;
};

export type ListItemActionProps = ListItemActionWithAsProp<{
    /** Title */
    title: string;

    /** Data attribute for testing purposes */
    dataHook?: string;

    /** Item theme (standard, dark, destructive) */
    skin?: ListItemActionSkin;

    /** Text Size (small, medium) */
    size?: ListItemActionSize;

    /** Prefix Icon */
    prefixIcon?: IconElement;

    /** Suffix Icon */
    suffixIcon?: IconElement;

    /** When present, it specifies that a button should automatically get focus when the page loads. */
    autoFocus?: boolean;

    /** should the text get ellipsed with tooltip, or should it get broken into lines when it reaches the end of its container */
    ellipsis?: boolean;

    /** Disabled */
    disabled?: boolean;

    /** Tooltip floating modifiers */
    tooltipModifiers?: EllipsisCommonProps;

    /** If true, the item is highlighted */
    highlighted?: boolean;

    /** Text of the list item subtitle */
    subtitle?: string;

    /** Specifies whether page should be scrolled to the focused item */
    shouldFocusWithoutScroll?: boolean;

    suffix?: string;

    hovered?: boolean;

    selected?: boolean;

    focusableOnFocus?: React.FocusEventHandler<HTMLButtonElement>;

    focusableOnBlur?: React.FocusEventHandler<HTMLButtonElement>;
}>;

export default class ListItemAction extends React.PureComponent<ListItemActionProps> {}

export type ListItemActionSkin = 'standard' | 'dark' | 'destructive';

export type ListItemActionSize = 'small' | 'medium';
