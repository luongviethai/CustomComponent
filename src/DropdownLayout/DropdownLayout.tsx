import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import type { Required, $Keys } from "utility-types";
import Loader from "../Loader";
import InfiniteScroll from "../utils/InfiniteScroll";
import scrollIntoView from "../utils/scrollIntoView";
import { filterObject } from "../utils/filterObject";
import { listItemSectionBuilder } from "../ListItemSection";
import { listItemSelectBuilder } from "../ListItemSelect";
import { listItemActionBuilder } from "@wix/design-system";
import { isString } from "../utils/StringUtils";
import { st, classes } from "./DropdownLayout.st.css";
import {
	DATA_HOOKS,
	DATA_OPTION,
	DATA_SHOWN,
	DATA_DIRECTION,
	DROPDOWN_LAYOUT_DIRECTIONS,
	OPTION_DATA_HOOKS,
	DROPDOWN_LAYOUT_LOADER,
	DATA_SELECTED_OPTION_ID,
} from "./DataAttr";
import type {
	DropdownLayoutOption,
	DropdownLayoutProps as DropdownLayoutPropsCore,
	DropdownLayoutValueOption,
} from "./types";

const MOUSE_EVENTS_SUPPORTED = ["mouseup", "touchend"];

export const KEY = {
	arrowLeft: "ArrowLeft",
	arrowUp: "ArrowUp",
	arrowRight: "ArrowRight",
	arrowDown: "ArrowDown",
	escape: "Escape",
	tab: "Tab",
	enter: "Enter",
	space: " ",
	home: "Home",
	end: "End",
};

const ListType = {
	action: "action",
	select: "select",
};

const modulu = (n: number, m: number) => {
	const remain = n % m;
	return remain >= 0 ? remain : remain + m;
};

const getUnit = (value: string | number) =>
	isString(value) ? value : `${value}px`;

const defaultProps = {
	options: [],
	tabIndex: 0,
	maxHeightPixels: 260,
	closeOnSelect: true,
	itemHeight: "small",
	selectedHighlight: true,
	inContainer: false,
	infiniteScroll: false,
	loadMore: null,
	hasMore: false,
	markedOption: false,
	overflow: "auto",
	listType: ListType.select,
	minHeight: 40,
	focusOnSelectedOption: true,
};

const NOT_HOVERED_INDEX = -1;

export const DIVIDER_OPTION_VALUE = "-";

export type DropdownLayoutState = {
	hovered: number;
	selectedId?: string | number;
	focusedItemId: string | number | null;
	loadedRowsMap: {};
	loadedRowCount: number;
	loadingRowCount: number;
	_timeoutIdMap?: any;
};

export type DropdownLayoutProps = Required<
	DropdownLayoutPropsCore,
	$Keys<typeof defaultProps>
>;

class DropdownLayout extends React.PureComponent<
	DropdownLayoutProps,
	DropdownLayoutState
> {
	static displayName = "DropdownLayout";
	static defaultProps = defaultProps;
	static NONE_SELECTED_ID = NOT_HOVERED_INDEX;
	private _boundEvents?: string[];
	containerRef: React.RefObject<HTMLDivElement>;
	options?: HTMLDivElement | null;
	selectedOption?: HTMLDivElement | null;
	focusableItemsIdsList: (string | number)[] = [];
	savedOnClicks: {
		id?: DropdownLayoutOption["id"];
		onClick?: DropdownLayoutValueOption["onClick"];
	}[] = [];
	children = {};

	constructor(props: DropdownLayoutProps) {
		super(props);
		this.containerRef = React.createRef();
		this.state = {
			hovered: NOT_HOVERED_INDEX,
			selectedId: props.selectedId,
			focusedItemId: null,
			loadedRowCount: 0,
			loadedRowsMap: {},
			loadingRowCount: 0,
		};
	}

	componentDidMount() {
		const { focusOnSelectedOption, scrollToOption, autoFocus } = this.props;

		if (focusOnSelectedOption) {
			this._focusOnSelectedOption();
		} else if (this.props.hasOwnProperty("focusOnOption")) {
			this._focusOnOption();
		}
		if (scrollToOption) {
			this._scrollToOption();
		}

		this._markOptionByProperty(this.props);

		// Deprecated
		MOUSE_EVENTS_SUPPORTED.forEach((eventName) => {
			document.addEventListener(eventName, this._onMouseEventsHandler, true);
		});

		this._boundEvents = MOUSE_EVENTS_SUPPORTED;

		if (autoFocus) {
			this._focusFirstOption();
		}
	}

	componentWillUnmount() {
		if (this._boundEvents && typeof document !== "undefined") {
			this._boundEvents.forEach((eventName) => {
				document.removeEventListener(
					eventName,
					this._onMouseEventsHandler,
					true
				);
			});
		}
	}

	componentDidUpdate(prevProps: DropdownLayoutProps) {
		const { focusOnOption } = this.props;

		if (prevProps.focusOnOption !== focusOnOption) {
			this._focusOnOption();
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps: DropdownLayoutProps) {
		if (this.props.visible !== nextProps.visible) {
			this._markOption(NOT_HOVERED_INDEX);
		}

		if (this.props.selectedId !== nextProps.selectedId) {
			this.setState({ selectedId: nextProps.selectedId });
		}

		// make sure the same item is hovered if options changed
		if (
			this.state.hovered !== NOT_HOVERED_INDEX &&
			(!nextProps.options[this.state.hovered] ||
				this.props.options[this.state.hovered].id !==
					nextProps.options[this.state.hovered].id)
		) {
			this._markOption(
				this._findIndex(
					nextProps.options,
					(item: DropdownLayoutOption) =>
						item.id === this.props.options[this.state.hovered].id
				)
			);
		}

		this._markOptionByProperty(nextProps);
	}

	_focusFirstOption() {
		this._focus(this.focusableItemsIdsList[0]);
	}

	// Deprecated
	_checkIfEventOnElements(e: { target: any }, elem: any) {
		let current = e.target;
		while (current.parentNode) {
			if (elem.indexOf(current) > -1) {
				return true;
			}
			current = current.parentNode;
		}

		return current !== document;
	}

	// Deprecated
	_onMouseEventsHandler = (e: any) => {
		if (
			!!ReactDOM.findDOMNode(this) &&
			!_.isNull(this) &&
			!this._checkIfEventOnElements(e, [ReactDOM.findDOMNode(this)])
		) {
			this._onClickOutside(e);
		}
	};

	// Deprecated
	_renderTopArrow() {
		const { withArrow, visible } = this.props;

		return withArrow && visible ? (
			<div data-hook={DATA_HOOKS.TOP_ARROW} className={classes.arrow} />
		) : null;
	}

	_convertOptionToListItemSectionBuilder({
		option,
		idx,
	}: {
		option: DropdownLayoutOption;
		idx: number;
	}) {
		if (!this._isSelectableOption(option)) {
			const currentOption: DropdownLayoutOption = option;
			return listItemSectionBuilder({
				dataHook: OPTION_DATA_HOOKS.DIVIDER,
				id: currentOption.id || idx,
				type: "divider",
			});
		}

		if (option.title) {
			return listItemSectionBuilder({
				dataHook: OPTION_DATA_HOOKS.TITLE,
				id: option.id,
				type: "subheader",
				title: option.title,
			});
		}
	}

	_convertOptionToListItemActionBuilder({ option, idx }) {
		const { id, value, disabled, optionTitle, title, ...rest } = option;
		return listItemActionBuilder({
			id: id !== undefined ? id : idx,
			ref: (ref) => (this.children[id] = ref),
			tabIndex: id === this.state.focusedItemId && !disabled ? "0" : "-1",
			disabled,
			title: optionTitle,
			...rest,
		});
	}

	_isControlled() {
		return (
			typeof this.props.selectedId !== "undefined" &&
			typeof this.props.onSelect !== "undefined"
		);
	}

	_focusOnSelectedOption() {
		if (this.selectedOption && this.options) {
			this.options.scrollTop = Math.max(
				this.selectedOption.offsetTop - this.selectedOption.offsetHeight,
				0
			);
		}
	}

	_setSelectedOptionNode(
		optionNode?: HTMLDivElement | null,
		option?: DropdownLayoutOption
	) {
		if (option?.id === this.state.selectedId) {
			this.selectedOption = optionNode;
		}
	}

	_onClickOutside = (event?: TouchEvent | MouseEvent) => {
		const { visible, onClickOutside } = this.props;
		if (visible && onClickOutside) {
			event && onClickOutside(event);
		}
	};

	_markOption(index: number, options?: DropdownLayoutOption[]) {
		const { onOptionMarked } = this.props;
		options = options || this.props.options;
		this.setState({ hovered: index });
		const option = options[index];
		onOptionMarked &&
			onOptionMarked(this._isSelectableOption(option) ? option : null);
	}

	_onSelect = (index: number, e: React.SyntheticEvent) => {
		const { options, onSelect, listType } = this.props;

		if (listType !== ListType.select) {
			this._onClose();
			return;
		}

		const chosenOption = options[index];

		if (chosenOption && this._isSelectableOption(chosenOption)) {
			const sameOptionWasPicked = chosenOption.id === this.state.selectedId;
			if (onSelect) {
				e.stopPropagation();
				onSelect(chosenOption, sameOptionWasPicked);
			}
		}
		if (!this._isControlled()) {
			this.setState({ selectedId: chosenOption && chosenOption.id });
		}
		return !!onSelect && chosenOption;
	};

	_onActionClick = (e: { id: string | number | null }) => {
		const option = _.find(this.savedOnClicks, (option) => option.id === e.id);
		option?.onClick && option.onClick(e);
	};

	_saveOnClicks = () => {
		this.savedOnClicks = this.props.options.map((option) => ({
			id: option.id,
			onClick: this._isSelectableOption(option) ? option.onClick : undefined,
		}));
	};

	_onMouseEnter = (index: number) => {
		if (this._isSelectableOption(this.props.options[index])) {
			this._markOption(index);
		}
	};

	_onMouseLeave = () => this._markOption(NOT_HOVERED_INDEX);

	_getMarkedIndex() {
		const { options } = this.props;
		const useHoverIndex = this.state.hovered > NOT_HOVERED_INDEX;
		const useSelectedIdIndex = typeof this.state.selectedId !== "undefined";

		let markedIndex: number;
		if (useHoverIndex) {
			markedIndex = this.state.hovered;
		} else if (useSelectedIdIndex) {
			markedIndex = options.findIndex(
				(option) => option.id === this.state.selectedId
			);
		} else {
			markedIndex = NOT_HOVERED_INDEX;
		}

		return markedIndex;
	}

	_markNextStep(step: number) {
		const { options } = this.props;

		if (!options.some(this._isSelectableOption)) {
			return;
		}

		let markedIndex = this._getMarkedIndex();

		do {
			markedIndex = Math.abs(
				modulu(Math.max(markedIndex + step, -1), options.length)
			);
		} while (!this._isSelectableOption(options[markedIndex]));

		this._markOptionAtIndex(markedIndex);
	}

	_focusOnOption = () => {
		const { focusOnOption, options } = this.props;

		const markedIndex = options.findIndex(
			(option) => option.id === focusOnOption
		);

		if (markedIndex !== -1) {
			this._markOptionAtIndex(markedIndex);
		} else {
			// Remove focus
			this._markOption(markedIndex);
		}
	};

	_scrollToOption() {
		if (this.options) {
			const { scrollToOption, options } = this.props;
			const optionIndex = options.findIndex(
				(option) => option.id === scrollToOption
			);
			const optionNode = this.options.childNodes[optionIndex];
			this.options.scrollTop = Math.max(
				(optionNode as HTMLDivElement).offsetTop -
					(optionNode as HTMLDivElement).offsetHeight,
				0
			);
		}
	}

	_markOptionAtIndex = (markedIndex: number) => {
		const { infiniteScroll } = this.props;

		this._markOption(markedIndex);

		const menuElement = this.options;
		const hoveredElement = infiniteScroll
			? (this.options as HTMLDivElement).childNodes[0].childNodes[markedIndex]
			: (this.options as HTMLDivElement).childNodes[markedIndex];

		scrollIntoView(menuElement, hoveredElement);
	};

	_onSelectListKeyDown = (event: React.KeyboardEvent) => {
		if (
			!this.props.visible ||
			this.props.isComposing ||
			this.props.listType !== ListType.select
		) {
			return false;
		}

		switch (event.key) {
			case KEY.arrowDown: {
				this._markNextStep(1);
				event.preventDefault();
				break;
			}

			case KEY.arrowUp: {
				this._markNextStep(-1);
				event.preventDefault();
				break;
			}

			case KEY.space:
			case KEY.enter: {
				if (!this._onSelect(this.state.hovered, event)) {
					return false;
				}
				break;
			}

			case KEY.tab: {
				if (this.props.closeOnSelect) {
					return this._onSelect(this.state.hovered, event);
				} else {
					if (this._onSelect(this.state.hovered, event)) {
						event.preventDefault();
						return true;
					} else {
						return false;
					}
				}
			}

			case KEY.escape: {
				this._onClose();
				break;
			}

			default: {
				return false;
			}
		}
		event.stopPropagation();
		return true;
	};

	_focus = (
		focusedItemId: string | number | null,
		e?: React.SyntheticEvent
	) => {
		e && e.preventDefault();

		if (_.isNil(focusedItemId)) return;

		const element = this.children[focusedItemId];

		if (!element) return;

		const native = element.focus;
		const focusableHOC = element.wrappedComponentRef;

		const callback = native
			? element.focus
			: focusableHOC
			? focusableHOC.innerComponentRef.focus
			: () => ({});

		this.setState({ focusedItemId }, () => callback());
	};

	_handleActionListNavigation = (
		event: React.KeyboardEvent,
		id: string | number
	) => {
		const length = this.focusableItemsIdsList.length;
		let focusedItemId = this.state.focusedItemId;
		const { key } = event;
		const currentMenuItemIndex = this.focusableItemsIdsList.indexOf(id);
		const firstMenuItem = this.focusableItemsIdsList[0];
		const lastMenuItem = this.focusableItemsIdsList[length - 1];

		if (key === KEY.arrowLeft || key === KEY.arrowUp) {
			focusedItemId =
				id === 0
					? lastMenuItem
					: this.focusableItemsIdsList[currentMenuItemIndex - 1];
		}

		if (key === KEY.arrowRight || key === KEY.arrowDown) {
			focusedItemId =
				currentMenuItemIndex === length - 1
					? firstMenuItem
					: this.focusableItemsIdsList[currentMenuItemIndex + 1];
		}

		if (key === KEY.home) {
			focusedItemId = firstMenuItem;
		}

		if (key === KEY.end) {
			focusedItemId = lastMenuItem;
		}

		if (focusedItemId !== this.state.focusedItemId) {
			this._focus(focusedItemId, event);
		}
	};

	_onActionListKeyDown = (event: React.KeyboardEvent, id: string | number) => {
		if (this.props.listType !== ListType.action) {
			return;
		}

		const { key } = event;

		if (key === KEY.space || key === KEY.enter) {
			event.preventDefault();
			this._onActionClick({ id: this.state.focusedItemId });
			this._onClose();
		} else if (key === KEY.escape || key === KEY.tab) {
			this._onClose();
		} else {
			this._handleActionListNavigation(event, id);
		}

		event.stopPropagation();
	};

	_onClose = () => {
		this._markOption(NOT_HOVERED_INDEX);

		if (this.props.onClose) {
			this.props.onClose();
		}
	};

	_renderNode(node?: React.ReactNode) {
		return node ? <div>{node}</div> : null;
	}

	_wrapWithInfiniteScroll = (scrollableElement: React.ReactNode) => (
		<InfiniteScroll
			useWindow
			dataHook={DATA_HOOKS.INFINITE_SCROLL_CONTAINER}
			scrollElement={this.options || undefined}
			loadMore={this.props.loadMore}
			hasMore={this.props.hasMore}
			data={this.props.options}
			loader={
				<div className={classes.loader}>
					<Loader dataHook={DROPDOWN_LAYOUT_LOADER} size="small" />
				</div>
			}
		>
			{scrollableElement}
		</InfiniteScroll>
	);

	/** for testing purposes only */
	_getDataAttributes = () => {
		const { visible, dropDirectionUp } = this.props;
		const { selectedId } = this.state;

		return filterObject(
			{
				"data-hook": DATA_HOOKS.CONTENT_CONTAINER,
				[DATA_SHOWN]: visible,
				[DATA_SELECTED_OPTION_ID]:
					selectedId === 0 ? `${selectedId}` : selectedId,
				[DATA_DIRECTION]: dropDirectionUp
					? DROPDOWN_LAYOUT_DIRECTIONS.UP
					: DROPDOWN_LAYOUT_DIRECTIONS.DOWN,
			},
			(_key, value) => !!value
		);
	};

	_convertCustomOptionToBuilder({ option }) {
		const { value, id, disabled, overrideOptionStyle, overrideStyle } = option;

		if (overrideStyle) {
			return {
				id,
				disabled,
				overrideStyle,
				value: () => <div data-hook={DATA_HOOKS.OPTION}>{value}</div>,
			};
		}

		if (overrideOptionStyle) {
			return {
				id,
				disabled,
				overrideOptionStyle,
				value: () => <div data-hook={DATA_HOOKS.OPTION}>{value}</div>,
			};
		}
	}

	_convertOptionToListItemSelectBuilder({ option }) {
		const { value, id, disabled } = option;
		const { selectedId } = this.state;
		const { itemHeight, selectedHighlight } = this.props;
		return listItemSelectBuilder({
			id,
			title: <div data-hook={DATA_HOOKS.OPTION}>{value}</div>,
			disabled,
			selected: id === selectedId && selectedHighlight,
			className: st(classes.selectableOption, { itemHeight }),
		});
	}

	_isBuilderOption({ option }: { option: DropdownLayoutOption }) {
		const { value } = option;
		return typeof value === "function";
	}

	_isCustomOption({ option }) {
		const { overrideOptionStyle, overrideStyle } = option;
		return overrideOptionStyle || overrideStyle;
	}

	_isActionOption({ option }) {
		return option.value === ListType.action;
	}

	_isItemSection({ option }) {
		const { value, title: isTitle } = option;

		return value === DIVIDER_OPTION_VALUE || isTitle;
	}

	_convertOptionToBuilder(option: DropdownLayoutOption, idx: number) {
		if (this._isBuilderOption({ option })) {
			return option;
		} else if (this._isActionOption({ option })) {
			return this._convertOptionToListItemActionBuilder({ option, idx });
		} else if (this._isItemSection({ option })) {
			return this._convertOptionToListItemSectionBuilder({ option, idx });
		} else if (this._isCustomOption({ option })) {
			return this._convertCustomOptionToBuilder({ option });
		} else {
			return this._convertOptionToListItemSelectBuilder({ option });
		}
	}

	_renderOption({
		option,
		idx,
		style,
		key,
	}: {
		option: DropdownLayoutOption;
		idx: number;
		style?: {};
		key?: number;
	}) {
		const builderOption = this._convertOptionToBuilder(option, idx);
		const content = this._renderOptionContent({
			option: builderOption,
			idx,
			hasLink: this._isSelectableOption(option) && !!option.linkTo,
			style,
			key,
		});
		return this._isSelectableOption(option) && option.linkTo ? (
			<a
				className={classes.linkItem}
				key={key || idx}
				data-hook={DATA_HOOKS.LINK_ITEM}
				href={option.linkTo}
				role="option"
				aria-selected={option.id === this.state.selectedId}
			>
				{content}
			</a>
		) : (
			content
		);
	}

	// For testing purposes only
	_getItemDataAttr = ({ hovered, selected, disabled }) => {
		const { itemHeight, selectedHighlight } = this.props;

		return filterObject(
			{
				[DATA_OPTION.DISABLED]: disabled,
				[DATA_OPTION.SELECTED]: selected && selectedHighlight,
				[DATA_OPTION.HOVERED]: hovered,
				/* deprecated */
				[DATA_OPTION.SIZE]: itemHeight,
			},
			(key, value) => !!value
		);
	};

	_renderOptionContent({
		option,
		idx,
		hasLink,
		style,
		key,
	}: {
		option: any;
		idx: number;
		hasLink: boolean;
		style?: {};
		key?: number;
	}) {
		const { itemHeight, selectedHighlight } = this.props;
		const { selectedId, hovered } = this.state;

		const { id, disabled, overrideStyle, overrideOptionStyle } = option;

		const optionState = {
			selected: id === selectedId,
			hovered: idx === hovered,
			disabled,
		};

		if (!disabled) {
			this.focusableItemsIdsList = [...this.focusableItemsIdsList, id];
		}
		return (
			<div
				{...this._getItemDataAttr({ ...optionState })}
				role={hasLink ? undefined : "option"}
				aria-selected={hasLink ? undefined : optionState.selected}
				className={
					overrideOptionStyle
						? undefined
						: st(classes.option, {
								...optionState,
								selected: optionState.selected && selectedHighlight,
								itemHeight,
								overrideStyle,
						  })
				}
				style={style}
				ref={(node) => this._setSelectedOptionNode(node, option)}
				onClick={!disabled ? (e) => this._onSelect(idx, e) : undefined}
				key={key || idx}
				onMouseEnter={() => this._onMouseEnter(idx)}
				onMouseLeave={this._onMouseLeave}
				data-hook={`dropdown-item-${id}`}
				onKeyDown={(e) => this._onActionListKeyDown(e, id)}
			>
				{option.value(optionState)}
			</div>
		);
	}

	_markOptionByProperty(props: DropdownLayoutProps) {
		if (this.state.hovered === NOT_HOVERED_INDEX && props.markedOption) {
			const selectableOptions = props.options.filter(this._isSelectableOption);
			if (selectableOptions.length) {
				const idToMark =
					props.markedOption === true
						? selectableOptions[0].id
						: props.markedOption;
				this._markOption(
					this._findIndex<DropdownLayoutOption>(
						props.options,
						(item: DropdownLayoutOption) => item.id === idToMark
					),
					props.options
				);
			}
		}
	}

	_findIndex<T>(
		arr: T[],
		predicate: (value: T, index: number, obj: T[]) => unknown
	) {
		return (Array.isArray(arr) ? arr : []).findIndex(predicate);
	}

	_isSelectableOption(
		option: DropdownLayoutOption
	): option is DropdownLayoutValueOption {
		return (
			option &&
			option.value !== DIVIDER_OPTION_VALUE &&
			!(option as DropdownLayoutValueOption).disabled &&
			!(option as DropdownLayoutValueOption).title
		);
	}

	_renderOptions(): JSX.Element[] | JSX.Element {
		this.focusableItemsIdsList = [];
		this._saveOnClicks();

		return this.props.options.map((option, idx) =>
			this._renderOption({ option, idx })
		);
	}

	render() {
		const {
			className,
			visible,
			dropDirectionUp,
			tabIndex,
			onMouseEnter,
			onMouseLeave,
			onMouseDown,
			fixedHeader,
			withArrow,
			fixedFooter,
			inContainer,
			overflow,
			maxHeightPixels,
			minWidthPixels,
			infiniteScroll,
			dataHook,
			listType,
			minHeight,
			virtualization,
		} = this.props;

		const renderedOptions = this._renderOptions();

		return (
			<div
				data-list-type={listType}
				data-hook={dataHook}
				className={st(
					classes.root,
					{
						visible,
						withArrow,
						direction: dropDirectionUp
							? DROPDOWN_LAYOUT_DIRECTIONS.UP
							: DROPDOWN_LAYOUT_DIRECTIONS.DOWN,
						containerStyles: !inContainer,
					},
					className
				)}
				style={{ minHeight }}
				tabIndex={tabIndex}
				onKeyDown={this._onSelectListKeyDown}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				onMouseDown={onMouseDown}
				ref={this.containerRef}
			>
				<div
					{...this._getDataAttributes()}
					className={classes.contentContainer}
					style={{
						overflow: virtualization ? "hidden" : overflow,
						maxHeight: getUnit(maxHeightPixels),
						minWidth: !_.isNil(minWidthPixels)
							? getUnit(minWidthPixels)
							: undefined,
					}}
				>
					{this._renderNode(fixedHeader)}
					<div
						className={classes.options}
						style={{
							maxHeight: getUnit(parseInt(maxHeightPixels as string, 10) - 35),
							overflow: virtualization ? "hidden" : overflow,
						}}
						ref={(_options) => (this.options = _options as HTMLDivElement)}
						data-hook={DATA_HOOKS.DROPDOWN_LAYOUT_OPTIONS}
						role="listbox"
					>
						{infiniteScroll
							? this._wrapWithInfiniteScroll(renderedOptions)
							: renderedOptions}
					</div>
					{this._renderNode(fixedFooter)}
				</div>
				{this._renderTopArrow()}
			</div>
		);
	}
}

export default DropdownLayout;
