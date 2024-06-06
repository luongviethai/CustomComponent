import React from 'react';
import { addEventListener } from 'consolidated-events';
import contains from 'document.contains';
import $ from 'jquery';
import objectValues from 'object.values';

const DISPLAY = {
    BLOCK: 'block',
    FLEX: 'flex',
    INLINE: 'inline',
    INLINE_BLOCK: 'inline-block',
    CONTENTS: 'contents'
};

const defaultProps = {
    disabled: false,
    useCapture: true,
    display: DISPLAY.BLOCK,
    excludeClassName: ''
};

type Props = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    disabled?: boolean;
    display?: string;
    excludeClassName?: string;
    onOutsideClick: (e: React.MouseEvent) => void;
    useCapture?: boolean;
};

export default class OutsideClickHandler extends React.Component<Props> {
    static defaultProps: typeof defaultProps;

    childNode: Element | null = null;

    removeMouseUp: (() => void) | null = null;

    removeMouseDown: (() => void) | null = null;

    constructor(props: Props) {
        super(props);

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.setChildNodeRef = this.setChildNodeRef.bind(this);
    }

    override componentDidMount() {
        const { disabled, useCapture } = this.props;

        if (!disabled) this.addMouseDownEventListener(useCapture!);
    }

    override componentDidUpdate() {
        const { disabled, useCapture } = this.props;
        this.removeEventListeners();
        if (!disabled) {
            this.addMouseDownEventListener(useCapture!);
        }
    }

    override componentWillUnmount() {
        this.removeEventListeners();
    }

    onMouseDown(e: MouseEvent) {
        const { useCapture } = this.props;

        const isDescendantOfRoot = !(this.childNode && contains(this.childNode, e.target));

        if (isDescendantOfRoot) {
            if (this.removeMouseUp) {
                this.removeMouseUp();
                this.removeMouseUp = null;
            }
            this.removeMouseUp = addEventListener(document, 'mouseup', this.onMouseUp, {
                capture: useCapture
            });
        }
    }

    onMouseUp(e: React.MouseEvent<Element, MouseEvent>) {
        const { excludeClassName = '', onOutsideClick } = this.props;

        const isDescendantOfRoot = this.childNode && contains(this.childNode, e.target);
        const isTargetExclude = (e.target as Element).classList.contains(excludeClassName);
        const isClosestExclude =
            excludeClassName !== '' && $(e.target as Element).closest(`.${excludeClassName}`).length;
        const isAbleOutsideClick = !(isDescendantOfRoot || isTargetExclude || isClosestExclude);

        if (this.removeMouseUp) {
            this.removeMouseUp();
            this.removeMouseUp = null;
        }

        if (isAbleOutsideClick) {
            onOutsideClick(e);
        }
    }

    setChildNodeRef(ref: HTMLDivElement) {
        this.childNode = ref;
    }

    addMouseDownEventListener(useCapture: boolean) {
        this.removeMouseDown = addEventListener(document, 'mousedown', this.onMouseDown, {
            capture: useCapture
        });
    }

    removeEventListeners() {
        if (this.removeMouseDown) this.removeMouseDown();
        if (this.removeMouseUp) this.removeMouseUp();
    }

    override render() {
        const {
            children,
            disabled,
            display,
            excludeClassName,
            onClick,
            onOutsideClick,
            style,
            useCapture,
            ...rest
        } = this.props;

        return (
            <div
                {...rest}
                ref={this.setChildNodeRef}
                style={
                    display !== DISPLAY.BLOCK && objectValues(DISPLAY).includes(display)
                        ? { display, ...style }
                        : { ...style }
                }
            >
                {children}
            </div>
        );
    }
}

OutsideClickHandler.defaultProps = defaultProps;
