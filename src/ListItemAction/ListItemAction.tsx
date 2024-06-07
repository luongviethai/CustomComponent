import React from 'react';
import { withFocusable } from 'mgz-ui-core/hocs/Focusable/FocusableHOC';
import { IconElement } from '../common';
import Text from '../Text';
import Box from '../Box';
import { st, classes } from './ListItemAction.st.css';
import type { ListItemActionProps, ListItemActionSize, ListItemActionSkin } from './types';

class ListItemActionComponent extends React.PureComponent<ListItemActionProps> {
    static displayName = 'ListItemAction';
    declare innerComponentRef: HTMLElement;

    focus() {
        if (this.innerComponentRef) {
            const scrollOptions = this.props.shouldFocusWithoutScroll ? { preventScroll: true } : {};
            this.innerComponentRef.focus(scrollOptions);
        }
    }

    _renderText = () => {
        const { title, size, ellipsis, tooltipModifiers, subtitle, disabled } = this.props;

        return (
            <Box direction="vertical" className={classes.textBox} width="100%">
                <Text
                    className={st(classes.text, { subtitle: Boolean(subtitle) })}
                    dataHook="list-item-action-title"
                    size={size}
                    ellipsis={ellipsis}
                    weight={'thin'}
                    placement="right"
                    skin={disabled ? 'disabled' : 'standard'}
                    {...tooltipModifiers}
                >
                    {title}
                </Text>

                {subtitle && (
                    <Text
                        dataHook="list-item-action-subtitle"
                        secondary
                        size="small"
                        ellipsis={ellipsis}
                        weight={'thin'}
                        tooltipProps={{
                            placement: 'right'
                        }}
                        skin={disabled ? 'disabled' : 'standard'}
                        light={!disabled}
                    >
                        {subtitle}
                    </Text>
                )}
            </Box>
        );
    };

    _renderPrefix = () => {
        const { prefixIcon, size, subtitle } = this.props;
        return prefixIcon
            ? React.cloneElement(prefixIcon, {
                  size: size === 'medium' ? 24 : 18,
                  className: st(classes.prefixIcon, { subtitle: Boolean(subtitle) }),
                  'data-hook': 'list-item-action-prefix-icon'
              })
            : null;
    };

    _renderSuffixIcon = () => {
        const { suffixIcon, size, subtitle } = this.props;
        return suffixIcon
            ? React.cloneElement(suffixIcon, {
                  size: size === 'medium' ? 24 : 18,
                  className: st(classes.suffixIcon, { subtitle: Boolean(subtitle) }),
                  'data-hook': 'list-item-action-suffix-icon'
              })
            : null;
    };

    _renderSuffix = () => {
        const { suffix, size, ellipsis, disabled } = this.props;
        return (
            <div className={classes.suffix}>
                <Text
                    dataHook="list-item-action-suffix"
                    secondary
                    size={size}
                    light={!disabled}
                    weight="thin"
                    skin={disabled ? 'disabled' : 'standard'}
                    ellipsis={ellipsis}
                    children={suffix}
                />
            </div>
        );
    };

    static defaultProps = {
        as: 'button',
        skin: 'standard',
        size: 'medium',
        highlighted: false
    };

    getRef() {
        return this.innerComponentRef;
    }

    render() {
        const {
            dataHook,
            disabled,
            skin,
            prefixIcon,
            suffix,
            suffixIcon,
            onClick,
            focusableOnFocus,
            focusableOnBlur,
            as: Component,
            tabIndex,
            onKeyDown,
            autoFocus,
            highlighted,
            className,
            subtitle,
            ...others
        } = this.props;

        // since we're spreading the "rest" props, we don't want to pass
        const { selected, hovered, ellipsis, title, shouldFocusWithoutScroll, ...rest } = others;

        return (
            // @ts-ignore
            <Component
                {...rest}
                className={st(classes.root, { skin, disabled, highlighted, ellipsis }, className)}
                data-skin={skin}
                data-disabled={disabled}
                tabIndex={tabIndex}
                ref={(ref: HTMLElement) => {
                    this.innerComponentRef = ref;
                }}
                autoFocus={autoFocus}
                onFocus={focusableOnFocus}
                onBlur={focusableOnBlur}
                type={Component === 'button' ? 'button' : undefined}
                data-hook={dataHook}
                onKeyDown={!disabled ? onKeyDown : undefined}
                onClick={!disabled ? onClick : undefined}
            >
                {prefixIcon && this._renderPrefix()}
                {this._renderText()}
                {suffix && this._renderSuffix()}
                {suffixIcon && this._renderSuffixIcon()}
            </Component>
        );
    }
}

export const ListItemAction = withFocusable(
    ListItemActionComponent
) as React.FunctionComponent<ListItemActionProps>;

type ListItemActionBuilderProps = {
    title: string;
    id: string | number;
    prefixIcon?: IconElement;
    suffixIcon?: IconElement;
    suffix?: string;
    onClick?: React.MouseEventHandler;
    disabled?: boolean;
    skin?: ListItemActionSkin;
    size?: ListItemActionSize;
    dataHook?: string;
    as?: any;
    tabIndex?: number;
    autoFocus?: boolean;
    className?: string;
    ellipsis?: boolean;
    subtitle?: string;
    shouldFocusWithoutScroll?: boolean;
};

type ListItemActionBuilderResult<T> = {
    id: string | number;
    disabled: boolean | undefined;
    overrideOptionStyle: true;
    value: (props: T) => React.ReactNode;
};

export function listItemActionBuilder<T extends ListItemActionProps>({
    title,
    prefixIcon,
    suffixIcon,
    suffix,
    onClick,
    id,
    disabled,
    skin,
    size,
    dataHook,
    as,
    tabIndex,
    autoFocus,
    className,
    ellipsis,
    subtitle,
    ...rest
}: ListItemActionBuilderProps): ListItemActionBuilderResult<T> {
    return {
        id,
        disabled,
        overrideOptionStyle: true,
        value: ({ hovered }) => (
            <ListItemAction
                {...rest}
                ellipsis={ellipsis}
                className={className}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                as={as}
                onClick={onClick}
                dataHook={dataHook}
                title={title}
                prefixIcon={prefixIcon}
                suffixIcon={suffixIcon}
                suffix={suffix}
                skin={skin}
                size={size}
                highlighted={hovered}
                disabled={disabled}
                subtitle={subtitle}
            />
        )
    };
}
