export interface DropdownLayoutProps {
	dataHook?: string;

	/** A single CSS class name to be appended to the root element. */
	className?: string;

	/** @deprecated */
	dropDirectionUp?: boolean;

	/** Scroll view to the selected option on opening the dropdown */
	focusOnSelectedOption?: boolean;

	/** Callback function called whenever the user press the `Escape` keyboard.*/
	onClose?: () => void;

	/** Callback function called whenever the user selects a different option in the list */
	onSelect?: (
		option: DropdownLayoutValueOption,
		sameOptionWasPicked: boolean
	) => void;

	/** Callback function called whenever an option becomes focused (hovered/active). Receives the relevant option object from the original props.options array. */
	onOptionMarked?: (option: DropdownLayoutValueOption | null) => void;

	/** Should show or hide the component */
	visible?: boolean;

	/** Array of objects:
	 * - id `<string / number>` *required*: the id of the option, should be unique.
	 * - value `<function / string / node>` *required*: can be a string, react element or a builder function.
	 * - disabled `<bool>` *default value- false*: whether this option is disabled or not
	 * - linkTo `<string>`: when provided the option will be an anchor to the given value
	 * - title `<bool>`  *default value- false*  **deprecated**: please use `listItemSectionBuilder` for rendering a title.
	 * - overrideStyle `<bool>` *default value- false*  **deprecated**: please use `overrideOptionStyle` for override option styles.
	 * - overrideOptionStyle `<bool>` *default value- false* - when set to `true`, the option will be responsible to its own styles. No styles will be applied from the DropdownLayout itself.
	 * - label `<string>`: the string displayed within an input when the option is selected. This is used when using `<DropdownLayout/>` with an `<Input/>`.
	 */
	options?: DropdownLayoutOption[];

	/** The id of the selected option in the list  */
	selectedId?: string | number;

	/** Specifies the tab order of the component. */
	tabIndex?: number;

	/** @deprecated Do not use this prop. */
	onClickOutside?: (e: TouchEvent | MouseEvent) => void;

	/** A fixed header to the list */
	fixedHeader?: React.ReactNode;

	/** A fixed footer to the list */
	fixedFooter?: React.ReactNode;

	/** Set the max height of the dropdownLayout in pixels */
	maxHeightPixels?: string | number;

	/** Set the min width of the dropdownLayout in pixels   */
	minWidthPixels?: string | number;

	/** @deprecated Do not use this prop. */
	withArrow?: boolean;

	/** Closes DropdownLayout on option selection */
	closeOnSelect?: boolean;

	/** Callback function called whenever the user entered with the mouse to the dropdown layout.*/
	onMouseEnter?: React.MouseEventHandler<HTMLElement>;

	/** Callback function called whenever the user exited with the mouse from the dropdown layout.*/
	onMouseLeave?: React.MouseEventHandler<HTMLElement>;

	/** @deprecated Do not use this prop. */
	itemHeight?: DropdownLayoutItemHeight;

	/** Whether the selected option will be highlighted when dropdown reopened. */
	selectedHighlight?: boolean;

	/** Whether the `<DropdownLayout/>` is in a container component. If `true`, some styles such as shadows, positioning and padding will be added the the component contentContainer. */
	inContainer?: boolean;

	/** Set this prop for lazy loading of the dropdown layout items.*/
	infiniteScroll?: boolean;

	/** A callback called when more items are requested to be rendered. */
	loadMore?: (page: number) => void;

	/** Whether there are more items to be loaded. */
	hasMore?: boolean;

	/** Sets the default hover behavior when:
	 *  1. `false` means no default
	 *  2. `true` means to hover the first selectable option
	 *  3. Any number/string represents the id of option to hover
	 */
	markedOption?: boolean | string | number;

	/** Set overflow of container */
	overflow?: Overflow;

	/** Marks (not selects) and scrolls view to the option on opening the dropdown by option id */
	focusOnOption?: string | number | null;

	/** Scrolls to the specified option when dropdown is opened without marking it */
	scrollToOption?: string | number;

	/** Defines type of behavior applied in list */
	listType?: ListType;

	/** Specifies whether first list item should be focused */
	autoFocus?: boolean;

	/** MouseDown event */
	onMouseDown?: React.MouseEventHandler<HTMLDivElement>;

	isComposing?: boolean;

	virtualization?: boolean;

	infiniteLoader?: boolean;

	maxHeight?: number;

	minHeight?: number;

	rowHeight?: number;

	optionHeight?: number;

	searchable?: boolean;

	searchDebounce?: number;

	emptyStateMessage?: string;

	listProps?: any;

	optionRenderer?: any;
}

export type Overflow = "visible" | "hidden" | "scroll" | "auto";

export type ListType = "action" | "select";

export type DropdownLayoutOption = DropdownLayoutValueOption;

export type DropdownLayoutValueOption = {
	id: string | number;
	value: React.ReactNode | string | RenderOptionFn;
	disabled?: boolean;
	title?: React.ReactNode | string;
	optionTitle?: string;
	linkTo?: string;
	overrideStyle?: boolean;
	overrideOptionStyle?: boolean;
	label?: string;
	onClick?: (e: any) => void;
};

export type RenderOptionFn = (options: {
	selected: boolean;
	hovered: boolean;
	disabled: boolean;
}) => JSX.Element;

export type DropdownLayoutDividerOption = {
	value: "-";
	id?: string | number;
};

export type DropdownLayoutItemHeight = "small" | "big";
