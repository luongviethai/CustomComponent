import React from "react";
import type { Required, $Keys } from "utility-types";
import Popover from "../Popover";
import DropdownLayout, { DropdownLayoutValueOption } from "../DropdownLayout";
import { st, classes } from "./DropdownBase.st.css";
import type { DropdownBaseProps as DropdownBasePropsCore } from "./types";
import { dataHooks } from "./constants";

type DropdownBaseState = {
	open?: boolean;
	selectedId: string | number;
	listAutoFocus: boolean;
};

type DropdownBaseProps = Required<
	DropdownBasePropsCore,
	$Keys<typeof defaultProps>
>;

const defaultProps = {
	placement: "bottom",
	appendTo: "parent",
	showArrow: false,
	maxHeight: "260px",
	fluid: false,
	animate: false,
	listType: "select",
	onShow: () => {},
	onHide: () => {},
};

class DropdownBase extends React.PureComponent<
	DropdownBaseProps,
	DropdownBaseState
> {
	static displayName = "DropdownBase";
	static defaultProps = defaultProps;
	triggerElementRef: React.RefObject<HTMLDivElement>;

	constructor(props: DropdownBaseProps) {
		super(props);
		this.triggerElementRef = React.createRef();
	}

	_dropdownLayoutRef: DropdownLayout | null = null;
	_shouldCloseOnMouseLeave = false;

	state = {
		open: this.props.open,
		selectedId: this.props.selectedId ?? this.props.initialSelectedId ?? -1,
		listAutoFocus: false,
	};

	/**
	 * Return `true` if the `open` prop is being controlled
	 */
	_isControllingOpen = (props = this.props) => {
		return typeof props.open !== "undefined";
	};

	/**
	 * Return `true` if the selection behaviour is being controlled
	 */
	_isControllingSelection = (props = this.props) => {
		return (
			typeof props.selectedId !== "undefined" &&
			typeof props.onSelect !== "undefined"
		);
	};

	_open = () => {
		if (this.state.open) {
			this._dropdownLayoutRef && this._dropdownLayoutRef._focusFirstOption();
			return;
		}

		if (!this._isControllingOpen()) {
			this.setState({ open: true });
			this.props.onShow();
		}
	};

	_close = (e?: any) => {
		if (this._isControllingOpen()) {
			return;
		}

		// If called within a `mouseleave` event on the target element, we would like to close the
		// popover only on the popover's `mouseleave` event
		if (e && e.type === "mouseleave") {
			// We're not using `setState` since we don't want to wait for the next render
			this._shouldCloseOnMouseLeave = true;
		} else {
			this.setState({ open: false, listAutoFocus: false });
		}
		this.props.onHide();
	};

	_toggle = () => {
		!this._isControllingOpen() &&
			this.setState(({ open }) => {
				if (open) {
					this.props.onHide();
				} else {
					this.props.onShow();
				}

				return {
					open: !open,
					listAutoFocus: false,
				};
			});
	};

	_handleClickOutside = () => {
		const { onClickOutside } = this.props;

		this._close();
		onClickOutside && onClickOutside();
	};

	_handlePopoverMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
		const { onMouseEnter } = this.props;

		onMouseEnter && onMouseEnter(e);
	};

	_handlePopoverMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
		const { onMouseLeave } = this.props;

		if (this._shouldCloseOnMouseLeave) {
			this._shouldCloseOnMouseLeave = false;

			this.setState({
				open: false,
			});
		}

		onMouseLeave && onMouseLeave(e);
	};

	_handleSelect = (selectedOption: DropdownLayoutValueOption) => {
		const newState = {} as DropdownBaseState;

		if (!this._isControllingOpen()) {
			newState.open = false;
			this.props.onHide();
		}

		if (!this._isControllingSelection()) {
			newState.selectedId = selectedOption.id;
		}

		this.setState(newState, () => {
			const { onSelect } = this.props;
			onSelect && onSelect(selectedOption);
		});
	};

	_handleClose = () => {
		if (this.state.open) {
			this._close();
		}

		if (this.triggerElementRef?.current?.focus) {
			this.triggerElementRef.current.focus();
		}
	};

	_getSelectedOption = (selectedId: string | number) => {
		return this.props.options?.find(({ id }) => id === selectedId);
	};

	/**
	 * Determine if a certain key should open the DropdownLayout
	 */
	_isOpenKey = (key: string) => {
		return ["Enter", " ", "ArrowDown"].includes(key);
	};

	_isClosingKey = (key: string) => {
		return ["Tab", "Escape"].includes(key);
	};

	/**
	 * A common `keydown` event that can be used for the target elements. It will automatically
	 * delegate the event to the underlying <DropdownLayout/>, and will determine when to open the
	 * dropdown depending on the pressed key.
	 */
	_handleKeyDown = (e) => {
		if (this._isControllingOpen()) {
			return;
		}

		const isHandledByDropdownLayout = this._delegateKeyDown(e);

		if (!isHandledByDropdownLayout) {
			if (this._isOpenKey(e.key)) {
				this.setState({ listAutoFocus: true });
				this._open();
				e.preventDefault();
			} else if (this._isClosingKey(e.key)) {
				this._close();
			}
		}
	};

	/*
	 * Delegate the event to the DropdownLayout. It'll handle the navigation, option selection and
	 * closing of the dropdown.
	 */
	_delegateKeyDown = (e) => {
		if (!this._dropdownLayoutRef) {
			return false;
		}

		return this._dropdownLayoutRef._onSelectListKeyDown(e);
	};

	UNSAFE_componentWillReceiveProps(nextProps) {
		// Keep internal state updated if needed
		if (
			this._isControllingOpen(nextProps) &&
			this.props.open !== nextProps.open
		) {
			this.setState({ open: nextProps.open });
		}

		if (
			this._isControllingSelection(nextProps) &&
			this.props.selectedId !== nextProps.selectedId
		) {
			this.setState({ selectedId: nextProps.selectedId });
		}
	}

	_renderChildren() {
		const { children } = this.props;
		const { selectedId, open } = this.state;

		if (!children) {
			return null;
		}

		return React.isValidElement(children)
			? children // Returning the children as is when using in controlled mode
			: //@ts-ignore
			  children({
					open: this._open,
					close: this._close,
					toggle: this._toggle,
					isOpen: Boolean(open),
					ref: this.triggerElementRef,
					delegateKeyDown: this._delegateKeyDown,

					selectedOption: this._getSelectedOption(selectedId),
			  });
	}

	render() {
		const {
			dataHook,
			placement,
			appendTo,
			showArrow,
			zIndex,
			moveBy,
			options,
			minWidth,
			maxWidth,
			fixed,
			flip,
			tabIndex,
			overflow,
			dynamicWidth,
			maxHeight,
			fluid,
			animate,
			className,
			focusOnSelectedOption,
			infiniteScroll,
			loadMore,
			hasMore,
			focusOnOption,
			scrollToOption,
			markedOption,
			onMouseDown,
			listType,
		} = this.props;

		const { open, selectedId } = this.state;
		return (
			<Popover
				data-list-type={listType}
				{...this.props} // backward compatible for migration stylable 1 to stylable 3
				animate={animate}
				dataHook={dataHook}
				shown={!!open}
				placement={placement}
				dynamicWidth={dynamicWidth}
				appendTo={appendTo}
				showArrow={showArrow}
				zIndex={zIndex}
				moveBy={moveBy}
				onKeyDown={this._handleKeyDown}
				onMouseEnter={this._handlePopoverMouseEnter}
				onMouseLeave={this._handlePopoverMouseLeave}
				onClickOutside={this._handleClickOutside}
				fixed={fixed}
				flip={flip}
				fluid={fluid}
				className={st(
					classes.root,
					{
						withWidth: Boolean(minWidth || maxWidth),
						withArrow: showArrow,
					},
					className
				)}
			>
				<Popover.Element>{this._renderChildren()}</Popover.Element>
				<Popover.Content>
					<div
						style={{
							minWidth,
							maxWidth,
						}}
					>
						<DropdownLayout
							dataHook={dataHooks.dropdownLayout}
							className={classes.list}
							ref={(r) => (this._dropdownLayoutRef = r)}
							selectedId={selectedId}
							options={options}
							maxHeightPixels={maxHeight}
							onSelect={this._handleSelect}
							onClose={this._handleClose}
							tabIndex={tabIndex}
							inContainer
							visible
							overflow={overflow}
							focusOnSelectedOption={focusOnSelectedOption}
							infiniteScroll={infiniteScroll}
							loadMore={loadMore}
							hasMore={hasMore}
							focusOnOption={focusOnOption}
							markedOption={markedOption}
							scrollToOption={scrollToOption}
							onMouseDown={onMouseDown}
							listType={listType}
							autoFocus={this.state.listAutoFocus}
						/>
					</div>
				</Popover.Content>
			</Popover>
		);
	}
}

export default DropdownBase;
