import * as React from "react";
// import type { MoveByOffset } from "../common";
import type {
	DropdownLayoutValueOption,
	DropdownLayoutProps,
	ListType,
} from "../DropdownLayout";
import type { PopoverProps } from "../Popover";

export interface DropdownBaseProps {
	/** Specifies a CSS class name to be appended to the component’s root element */
	className?: string;

	/** Applies a data-hook HTML attribute that can be used in the tests */
	dataHook?: string;

	/** Control whether the <Popover/> should be opened */
	open?: boolean;

	/** Control popover placement */
	placement?: PopoverProps["placement"];

	/** Specifies where popover should be inserted as a last child - whether `parent` or `window` containers */
	appendTo?: PopoverProps["appendTo"];

	/** Specifies whether popover arrow should be shown */
	showArrow?: boolean;

	/** Defines a callback function which is called when user clicks outside of a dropdown */
	onClickOutside?: () => void;

	/** Defines a callback function which is called on `onMouseEnter` event on the entire component */
	onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;

	/** Defines a callback function which is called on `onMouseLeave` event on the entire component */
	onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;

	/** Defines a callback function which is called on `onMouseDown` event on the entire component */
	onMouseDown?: React.KeyboardEventHandler<HTMLDivElement>;

	/** Defines a callback function which is called when dropdown is opened */
	onShow?: () => void;

	/** Defines a callback function which is called when dropdown is closed */
	onHide?: () => void;

	/** Defines a callback function which is called whenever user selects a different option in the list */
	onSelect?: (option: DropdownLayoutValueOption) => void;

	/**
	 * Set popover's content width to a minimum width of a trigger element,
	 * but it can expand up to the defined value of `maxWidth`
	 */
	dynamicWidth?: boolean;

	/** Controls the maximum width of dropdown layout */
	maxWidth?: React.CSSProperties["maxWidth"];

	/** Controls the minimum width of dropdown layout */
	minWidth?: React.CSSProperties["minWidth"];

	/** Controls the maximum height of dropdown layout */
	maxHeight?: number | string;

	/**
	 * Specifies a target component to be rendered. If a regular node is passed, it'll be rendered as-is.
	 * If a function is passed, it's expected to return a React element.
	 * The function accepts an object containing the following properties:
	 *
	 *  * `open` - will open the Popover
	 *  * `close` - will close the Popover
	 *  * `toggle` - will toggle the Popover
	 *  * `isOpen` - indicates whether the items list is currently open
	 *  * `delegateKeyDown` - the underlying DropdownLayout's keydown handler. It can be called
	 *                        inside another keyDown event in order to delegate it.
	 *  * `selectedOption` - the currently selected option
	 *
	 * Check inserted component documentation for more information on available properties.
	 */
	children?: DropdownBaseChildrenFn;

	/**
	 * Specifies an array of options for a dropdown list. Objects must have an id and can include string value or node.
	 * If value is '-', a divider will be rendered instead (dividers do not require and id).
	 */
	options?: DropdownLayoutProps["options"];

	/** Sets the default hover behavior when:
	 *  1. `false` means no default
	 *  2. `true` means to hover the first selectable option
	 *  3. Any number/string represents the id of option to hover
	 */
	markedOption?: boolean | string | number;

	/** Define the selected option in the list */
	selectedId?: string | number | null;

	/** Handles container overflow behaviour */
	overflow?: DropdownLayoutProps["overflow"];

	/** Indicates that element can be focused and where it participates in sequential keyboard navigation */
	tabIndex?: number;

	/**
	 * Sets the initially selected option in the list. Used when selection
	 * behaviour is being controlled.
	 */
	initialSelectedId?: string | number;

	/** Specifies the stack order (`z-index`) of a dropdown layout */
	zIndex?: number;

	/** Moves dropdown content relative to the parent on X or Y axis by a defined amount of pixels */
	moveBy?: MoveByOffset;

	/**
	 * Specifies whether to flip the <Popover/> placement
	 * when it starts to overlap the target element (<Popover.Element/>)
	 */
	flip?: boolean;

	/**
	 * Specifies whether to enable the fixed behaviour. If enabled, <Popover/> keep its
	 * original placement even when it's being positioned outside the boundary.
	 */
	fixed?: boolean;

	/** Stretches trigger element to fill its parent container width */
	fluid?: boolean;

	/** Adds enter and exit animation */
	animate?: boolean;

	/** Scrolls to the selected option when dropdown is opened */
	focusOnSelectedOption?: boolean;

	/** Specifies whether lazy loading of the dropdown items is enabled */
	infiniteScroll?: boolean;

	/** Defines a callback function which is called on a request to render more list items */
	loadMore?: (page: number) => void;

	/** Specifies whether there are more items to load */
	hasMore?: boolean;

	/** Scrolls to the specified option when dropdown is opened */
	focusOnOption?: DropdownLayoutProps["focusOnOption"];

	/** Scrolls to the specified option when dropdown is opened without marking it */
	scrollToOption?: DropdownLayoutProps["scrollToOption"];

	/** Defines type of behavior applied in list */
	listType?: ListType;
}

export default class DropdownBase extends React.PureComponent<DropdownBaseProps> {}

export type DropdownBaseChildrenFn = React.ReactNode | ChildrenFnArgs;

export type ChildrenFnArgs = (data: {
	open: () => void;
	close: (e: React.SyntheticEvent) => void;
	toggle: () => void;
	delegateKeyDown: React.KeyboardEventHandler;
	selectedOption: DropdownLayoutValueOption;
	isOpen: boolean;
}) => React.ReactNode;
