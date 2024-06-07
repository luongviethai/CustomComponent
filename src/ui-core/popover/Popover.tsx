import * as React from "react";
import { Manager, Reference, Popper } from "react-popper";
import { CSSTransition } from "react-transition-group";
import { Portal } from "react-portal";
import uniqueId from "lodash/uniqueId";
import classNames from "classnames";
import { ClickOutside } from "../click-outside";
import { filterDataProps } from "../utils/filter-data-props";
import {
	buildChildrenObject,
	createComponentThatRendersItsChildren,
} from "../utils";
import { st, classes } from "./Popover.st.css";
import { createModifiers } from "./modifiers";
import { PopoverContext } from "./PopoverContext";
import { popoverTestUtils } from "./helpers";
import { getAppendToElement } from "./utils/getAppendToElement";
import type { PopoverProps, PopoverState } from "./types";

// This is here and not in the test setup because we don't want consumers to need to run it as well
let testId: string;
const isTestEnv = process.env.NODE_ENV === "test";

if (isTestEnv && typeof document !== "undefined" && !document.createRange) {
	popoverTestUtils.createRange();
}

const attachClasses = (node: HTMLElement, classnames: string) =>
	node && node.classList.add(...classnames.split(" "));
const detachClasses = (node: HTMLElement, classnames: string) =>
	node && node.classList.remove(...classnames.split(" "));

const shouldAnimatePopover = ({ timeout }: PopoverProps) => {
	if (typeof timeout === "object") {
		const { enter, exit } = timeout;

		return (
			typeof enter !== "undefined" &&
			typeof exit !== "undefined" &&
			(enter > 0 || exit > 0)
		);
	}

	return !!timeout;
};

const getArrowShift = (shift: number | undefined, direction: string) => {
	if (!shift && !isTestEnv) return {};
	if (direction.startsWith("top") || direction.startsWith("bottom"))
		return { left: `${shift}px` };
	if (direction.startsWith("left") || direction.startsWith("right"))
		return { top: `${shift}px` };

	// Arrow can't be shifted when using automatic positioning
	return {};
};

export class Popover extends React.Component<PopoverProps, PopoverState> {
	static displayName = "Popover";

	static defaultProps = {
		flip: true,
		fixed: false,
		zIndex: 1000,
	};

	static Element = createComponentThatRendersItsChildren("Popover.Element");
	static Content = createComponentThatRendersItsChildren("Popover.Content");

	targetRef: HTMLElement | null = null;
	portalNode: HTMLElement | null = null;
	portalClasses!: string;
	appendToNode: HTMLElement | null = null;
	clickOutsideRef: any = null;
	popoverContentRef: React.RefObject<HTMLDivElement>;
	clickOutsideClass: string;
	contentHook: string;

	popperScheduleUpdate!: (() => void) | null;

	// Timer instances for the show/hide delays
	_hideTimeout: any = null;
	_showTimeout: any = null;

	constructor(props: PopoverProps) {
		super(props);
		this.state = {
			isMounted: false,
			shown: props.shown || false,
		};

		if (isTestEnv) {
			testId = popoverTestUtils.generateId();
		}

		this.clickOutsideRef = React.createRef();
		this.popoverContentRef = React.createRef();
		this.clickOutsideClass = uniqueId("clickOutside");
		this.contentHook = `popover-content-${props["data-hook"] || ""}${
			testId ? "-" + testId : ""
		}`;
	}

	_handleClickOutside = (event: MouseEvent) => {
		const {
			onClickOutside: onClickOutsideCallback,
			shown,
			disableClickOutsideWhenClosed,
		} = this.props;
		if (onClickOutsideCallback && !(disableClickOutsideWhenClosed && !shown)) {
			onClickOutsideCallback(event);
		}
	};

	_onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const { onEscPress } = this.props;

		if (onEscPress && e.key === "Escape") onEscPress(e);
	};

	public focus() {
		if (this.popoverContentRef.current) {
			this.popoverContentRef.current.focus();
		}
	}

	getPopperContentStructure(childrenObject: { Element: any; Content: any }) {
		const { shown } = this.state;
		const {
			moveBy,
			appendTo,
			placement,
			showArrow,
			moveArrowTo,
			flip,
			fixed,
			customArrow,
			role,
			id,
			zIndex,
			minWidth,
			maxWidth,
			width,
			dynamicWidth,
			excludeClass = this.clickOutsideClass,
			contentClassName,
			onEscPress,
			tabIndex,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledby,
			"aria-describedby": ariaDescribedBy,
		} = this.props;
		const shouldAnimate = shouldAnimatePopover(this.props);

		const modifiers = createModifiers({
			minWidth,
			width,
			dynamicWidth,
			moveBy,
			appendTo,
			shouldAnimate,
			flip,
			placement,
			fixed,
			isTestEnv,
		});

		const popper = (
			<Popper modifiers={modifiers} placement={placement}>
				{({
					ref,
					style: popperStyles,
					placement: popperPlacement,
					arrowProps,
					scheduleUpdate,
				}) => {
					this.popperScheduleUpdate = scheduleUpdate;
					return (
						<PopoverContext.Consumer>
							{({ excludeClickOutsideClasses }) => {
								return (
									<div
										ref={ref}
										data-hook="popover-content"
										data-content-element={this.contentHook}
										style={{ ...popperStyles, zIndex, maxWidth }}
										data-placement={popperPlacement || placement}
										className={classNames(
											classes.popover,
											this.clickOutsideClass,
											contentClassName,
											{
												[classes.withArrow]: showArrow,
												[classes.popoverContent]: !showArrow,
											},
											...excludeClickOutsideClasses
										)}
									>
										{showArrow &&
											this.renderArrow(
												arrowProps,
												moveArrowTo,
												popperPlacement || placement,
												customArrow
											)}
										<div
											key="popover-content"
											id={id}
											role={role}
											tabIndex={tabIndex}
											ref={this.popoverContentRef}
											className={showArrow ? classes.popoverContent : ""}
											onKeyDown={
												shown && onEscPress ? this._onKeyDown : undefined
											}
											aria-label={ariaLabel}
											aria-labelledby={ariaLabelledby}
											aria-describedby={ariaDescribedBy}
										>
											<PopoverContext.Provider
												value={{
													excludeClickOutsideClasses: [
														excludeClass,
														...excludeClickOutsideClasses,
													],
												}}
											>
												{childrenObject.Content}
											</PopoverContext.Provider>
										</div>
									</div>
								);
							}}
						</PopoverContext.Consumer>
					);
				}}
			</Popper>
		);

		return this.wrapWithAnimations(popper);
	}

	applyStylesToPortaledNode() {
		const { shown } = this.state;
		const shouldAnimate = shouldAnimatePopover(this.props);

		if (this.portalNode) {
			if (shouldAnimate || shown) {
				attachClasses(this.portalNode, this.portalClasses);
			} else {
				detachClasses(this.portalNode, this.portalClasses);
			}
		}
	}

	wrapWithAnimations(popper: JSX.Element) {
		const { timeout } = this.props;
		const { shown } = this.state;

		const shouldAnimate = shouldAnimatePopover(this.props);

		return shouldAnimate ? (
			<CSSTransition
				in={shown}
				timeout={timeout}
				unmountOnExit
				classNames={{
					enter: classes["popoverAnimation-enter"],
					enterActive: classes["popoverAnimation-enter-active"],
					exit: classes["popoverAnimation-exit"],
					exitActive: classes["popoverAnimation-exit-active"],
				}}
				onExited={() =>
					this.portalNode && detachClasses(this.portalNode, this.portalClasses)
				}
			>
				{popper}
			</CSSTransition>
		) : (
			popper
		);
	}

	renderPopperContent(childrenObject: { Element: any; Content: any }) {
		const popper = this.getPopperContentStructure(childrenObject);

		return this.portalNode ? (
			<Portal node={this.portalNode}>{popper}</Portal>
		) : (
			popper
		);
	}

	renderArrow(
		arrowProps: { ref: React.Ref<any>; style: React.CSSProperties },
		moveArrowTo: number | undefined,
		placement: PopoverProps["placement"],
		customArrow: PopoverProps["customArrow"]
	) {
		const commonProps = {
			ref: arrowProps.ref,
			key: "popover-arrow",
			"data-hook": "popover-arrow",
			style: {
				...arrowProps.style,
				...getArrowShift(moveArrowTo, placement ? placement : "auto"),
			},
		};

		if (customArrow)
			return customArrow(placement ? placement : "auto", commonProps);

		return <div {...commonProps} className={classes.arrow} />;
	}

	componentDidMount() {
		const { shown, onTabOut } = this.props;
		this.initAppendToNode();
		if (onTabOut && shown) this._setBlurByKeyboardListener();
		this.setState({ isMounted: true });
	}

	/**
	 * Checks to see if the focused element is outside the Popover content
	 */
	_onDocumentKeyUp = (e: KeyboardEvent) => {
		const { onTabOut } = this.props;

		if (
			typeof document !== "undefined" &&
			this.popoverContentRef.current &&
			!this.popoverContentRef.current.contains(document.activeElement) &&
			onTabOut
		) {
			onTabOut(e);
		}
	};

	_setBlurByKeyboardListener() {
		if (typeof document !== "undefined")
			document.addEventListener("keyup", this._onDocumentKeyUp, true);
	}

	_removeBlurListener() {
		if (typeof document !== "undefined")
			document.removeEventListener("keyup", this._onDocumentKeyUp, true);
	}

	initAppendToNode() {
		const { appendTo } = this.props;
		this.appendToNode =
			this.targetRef && getAppendToElement(appendTo, this.targetRef);
		if (this.appendToNode) {
			this.portalNode = document.createElement("div");
			this.portalNode.setAttribute("data-hook", "popover-portal");
			/**
			 * reset overlay wrapping layer
			 * so that styles from copied classnames
			 * won't break the overlay:
			 * - content is position relative to body
			 * - overlay layer is hidden
			 */
			Object.assign(this.portalNode.style, {
				position: "static",
				top: 0,
				left: 0,
				width: 0,
				height: 0,
			});
			this.appendToNode.appendChild(this.portalNode);
		}
	}

	hidePopover() {
		const { isMounted } = this.state;
		const { hideDelay, onTabOut } = this.props;

		if (!isMounted || this._hideTimeout) return;

		if (this._showTimeout) {
			clearTimeout(this._showTimeout);
			this._showTimeout = null;
		}

		if (onTabOut) this._removeBlurListener();

		if (hideDelay) {
			this._hideTimeout = setTimeout(() => {
				this.setState({ shown: false });
			}, hideDelay);
		} else {
			this.setState({ shown: false });
		}
	}

	showPopover() {
		const { isMounted } = this.state;
		const { showDelay, onTabOut } = this.props;

		if (!isMounted || this._showTimeout) return;

		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}

		if (onTabOut) this._setBlurByKeyboardListener();

		if (showDelay) {
			this._showTimeout = setTimeout(() => {
				this.setState({ shown: true });
			}, showDelay);
		} else {
			this.setState({ shown: true });
		}
	}

	componentWillUnmount() {
		if (this.portalNode && this.appendToNode?.children.length) {
			// FIXME: What if component is updated with a different appendTo? It is a far-fetched use-case,
			// but we would need to remove the portaled node, and created another one.
			this.appendToNode.removeChild(this.portalNode);
		}
		this.portalNode = null;

		if (this._hideTimeout) {
			clearTimeout(this._hideTimeout);
			this._hideTimeout = null;
		}

		if (this._showTimeout) {
			clearTimeout(this._showTimeout);
			this._showTimeout = null;
		}
	}

	updatePosition() {
		if (this.popperScheduleUpdate) this.popperScheduleUpdate();
	}

	componentDidUpdate(prevProps: PopoverProps) {
		const { shown } = this.props;
		if (this.portalNode) {
			// Re-calculate the portal's styles
			this.portalClasses = st(classes.root, this.props.className);

			// Apply the styles to the portal
			this.applyStylesToPortaledNode();
		}

		// Update popover visibility
		if (prevProps.shown !== shown) {
			shown ? this.showPopover() : this.hidePopover();
		} else {
			// Update popper's position
			this.updatePosition();
		}
	}

	render() {
		const {
			onMouseEnter,
			onMouseLeave,
			onKeyDown,
			onClick,
			children,
			style,
			id,
			excludeClass = this.clickOutsideClass,
			fluid,
		} = this.props;
		const { isMounted, shown } = this.state;

		const childrenObject = buildChildrenObject(children, {
			Element: null,
			Content: null,
		});

		const shouldAnimate = shouldAnimatePopover(this.props);
		const shouldRenderPopper = isMounted && (shouldAnimate || shown);

		return (
			<Manager>
				<ClickOutside
					rootRef={this.clickOutsideRef}
					onClickOutside={shown ? this._handleClickOutside : undefined}
					excludeClass={[this.clickOutsideClass, excludeClass || ""]}
				>
					<div
						ref={this.clickOutsideRef}
						style={style}
						data-content-hook={this.contentHook}
						className={st(classes.root, { fluid }, this.props.className)}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						id={id}
						{...filterDataProps(this.props)}
					>
						<Reference innerRef={(r) => (this.targetRef = r)}>
							{({ ref }) => (
								<div
									ref={ref}
									className={classes.popoverElement}
									data-hook="popover-element"
									onClick={onClick}
									onKeyDown={onKeyDown}
								>
									{childrenObject.Element}
								</div>
							)}
						</Reference>
						{shouldRenderPopper && this.renderPopperContent(childrenObject)}
					</div>
				</ClickOutside>
			</Manager>
		);
	}
}
