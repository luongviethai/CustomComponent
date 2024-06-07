import type PopperJS from "popper.js";
import type { ElementProps } from "../utils";
import type { MoveBy } from "./utils/getModifiers";
import type { Predicate } from "./utils/getAppendToElement";

export type Placement = PopperJS.Placement;
export type AppendTo = PopperJS.Boundary | "parent" | Element | Predicate;

export interface PopoverProps {
	/** hook for testing purposes */
	"data-hook"?: string;
	/** custom classname */
	className?: string;
	/** The location to display the content */
	placement?: Placement;
	/** Is the content shown or not */
	shown: boolean;
	/** onClick on the component */
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	/** Provides callback to invoke when clicked outside of the popover */
	onClickOutside?: Function;
	/** Provides callback to invoke when popover loses focus */
	onTabOut?: Function;
	/** Provides callback to invoke when popover loses focus */
	onEscPress?: Function;
	/**
	 * Clicking on elements with this excluded class will will not trigger onClickOutside callback
	 */
	excludeClass?: string;
	/** onMouseEnter on the component */
	onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
	/** onMouseLeave on the component */
	onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
	/** onKeyDown on the target component */
	onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
	/** Show show arrow from the content */
	showArrow?: boolean;
	/**
	 * Whether to enable the flip behaviour. This behaviour is used to flip the `<Popover/>`'s placement
	 * when it starts to overlap the target element (`<Popover.Element/>`).
	 */
	flip?: boolean;
	/**
	 * Whether to enable the fixed behaviour. This behaviour is used to keep the `<Popover/>` at it's
	 * original placement even when it's being positioned outside the boundary.
	 */
	fixed?: boolean;
	/** Moves popover relative to the parent */
	moveBy?: MoveBy;
	/** Hide Delay in ms */
	hideDelay?: number;
	/** Show Delay in ms */
	showDelay?: number;
	/** Moves arrow by amount */
	moveArrowTo?: number;
	/** Enables calculations in relation to a dom element */
	appendTo?: AppendTo;
	/** Animation timer */
	timeout?: number | { enter: number; exit: number };
	/** Inline style */
	style?: object;
	/** Id */
	id?: string;
	/* stretch trigger element to the width of its container. */
	fluid?: boolean;

	/** Custom arrow element */
	customArrow?(placement: Placement, arrowProps: object): React.ReactNode;

	/** target element role value */
	role?: string;
	/** popover z-index */
	zIndex?: number;
	/**
	 * popovers content is set to minnimum width of trigger element,
	 * but it can expand up to the value of maxWidth.
	 */
	dynamicWidth?: boolean;
	/**
	 * popover content minWidth value
	 * - `number` value which converts to css with `px`
	 * - `string` value that contains `px`
	 */
	minWidth?: number | string;
	/**
	 * popover content maxWidth value
	 * - `number` value which converts to css with `px`
	 * - `string` value that contains `px`
	 */
	maxWidth?: number | string;
	/**
	 * popover content width value
	 * - `number` value which converts to css with `px`
	 * - `string` value that contains `px`
	 */
	width?: number | string;
	/**
	 * Breaking change:
	 * When true - onClickOutside will be called only when popover content is shown
	 */
	disableClickOutsideWhenClosed?: boolean;

	dataHook?: string;
	/**
	 * the classname to be passed to the popover's content container
	 */
	contentClassName?: string;
	/**
	 * tabindex for popover content element
	 */
	tabIndex?: number;
	/**
	 * can focus on popover content element
	 */
	["aria-label"]?: string;
	["aria-labelledby"]?: string;
	["aria-describedby"]?: string;
}

export interface PopoverState {
	isMounted: boolean;
	shown: boolean;
}

export type PopoverType = PopoverProps & {
	Element?: React.FunctionComponent<ElementProps>;
	Content?: React.FunctionComponent<ElementProps>;
};
