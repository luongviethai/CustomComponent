import { DIVIDER_OPTION_VALUE } from "./DropdownLayout";
import type { DropdownLayoutOption, DropdownLayoutValueOption } from "./types";
import React, { Component } from "react";
import type { Required, $Keys } from "utility-types";

export const isString = (a) => typeof a === "string";

export const isSelectableOption = (
	option?: DropdownLayoutOption
): option is DropdownLayoutValueOption =>
	!!option &&
	option.value !== DIVIDER_OPTION_VALUE &&
	!(option as DropdownLayoutValueOption).disabled &&
	!(option as DropdownLayoutValueOption).title;

export function scrollIntoView(parentElement, focusedElement) {
	const parentRect = parentElement.getBoundingClientRect();
	const focusedRect = focusedElement.getBoundingClientRect();

	// We'll change the `scrollTop` only when needed. For example, when the
	// focused element is already in the view, we won't change it.
	if (focusedRect.bottom > parentRect.bottom) {
		// The hovered element is *below* the view
		parentElement.scrollTop = Math.min(
			focusedElement.offsetTop +
				focusedElement.clientHeight -
				parentElement.offsetHeight,
			parentElement.scrollHeight
		);
	} else if (focusedRect.top < parentRect.top) {
		// The hovered element is *above* the view
		parentElement.scrollTop = Math.max(focusedElement.offsetTop, 0);
	}
}

export const filterObject = (
	object: Record<string, any>,
	filter = (_key: string, _value: any) => true
) => {
	const output = {};
	for (const key in object) {
		// eslint-disable-next-line no-prototype-builtins
		if (object.hasOwnProperty(key) && filter(key, object[key])) {
			output[key] = object[key];
		}
	}
	return output;
};

interface InfiniteScrollPropsCore
	extends Omit<React.HTMLProps<InfiniteScroll>, "data"> {
	/**
	 * Name of the element that the component should render as.
	 * Defaults to 'div'.
	 */
	element?: React.ReactNode | string | undefined;

	/**
	 * Whether there are more items to be loaded. Event listeners are removed if false.
	 * Defaults to false.
	 */
	hasMore?: boolean | undefined;

	/**
	 * Whether the component should load the first set of items.
	 * Defaults to true.
	 */
	initialLoad?: boolean | undefined;

	/**
	 * Whether new items should be loaded when user scrolls to the top of the scrollable area.
	 * Default to false.
	 */
	isReverse?: boolean | undefined;

	/**
	 * A callback for when more items are requested by the user.
	 * Page param is next page index.
	 */
	loadMore(page: number): void;

	/**
	 * The number of the first page to load, with the default of 0, the first page is 1.
	 * Defaults to 0.
	 */
	pageStart?: number | undefined;

	/**
	 * The distance in pixels before the end of the items that will trigger a call to loadMore.
	 * Defaults to 250.
	 */
	threshold?: number | undefined;

	/**
	 * Proxy to the useCapture option of the added event listeners.
	 * Defaults to false.
	 */
	useCapture?: boolean | undefined;

	/**
	 * Add scroll listeners to the window, or else, the component's parentNode.
	 * Defaults to true.
	 */
	useWindow?: boolean | undefined;

	/**
	 * Loader component for indicating "loading more".
	 */
	loader?: React.ReactElement | undefined;

	/**
	 * Override method to return a different scroll listener if it's not the immediate parent of InfiniteScroll.
	 */
	getScrollParent?(): HTMLElement | null;

	scrollElement?: HTMLDivElement;

	dataHook?: string;

	data?: any[];
}

type InfiniteScrollProps = Required<
	InfiniteScrollPropsCore,
	$Keys<typeof defaultProps>
>;

const defaultProps = {
	hasMore: false,
	initialLoad: true,
	pageStart: 0,
	threshold: 250,
	useWindow: true,
	isReverse: false,
	scrollElement: null,
};

// This is a copy of https://github.com/CassetteRocks/react-infinite-scroller with https://github.com/CassetteRocks/react-infinite-scroller/pull/38/files merged
export default class InfiniteScroll extends Component<InfiniteScrollProps> {
	static defaultProps = defaultProps;
	_defaultLoader?: React.ReactElement;
	pageLoaded!: number;
	scrollComponent?: HTMLElement;

	constructor(props: InfiniteScrollProps) {
		super(props);
		this.scrollListener = this.scrollListener.bind(this);
	}

	componentDidMount() {
		this.pageLoaded = this.props.pageStart;
		this.attachScrollListener();
		if (this.props.initialLoad) {
			this.scrollListener();
		}
		// when component mounts try to load more only when initial data was already rendered
		else if (this.props.data?.length && this.props.hasMore) {
			this.scrollComponent?.scrollHeight && this.scrollListener();
		}
	}

	componentDidUpdate(prevProps: InfiniteScrollProps) {
		this.attachScrollListener();

		// scroll element might be not scrollable - trigger scroll listener when new data changes the scroll element height
		if (
			prevProps.data?.length !== this.props.data?.length &&
			this.props.hasMore
		) {
			// To avoid infinite loop of `loadMore` in `jsdom` we require the scroll element to have height before we trigger `scrollListener` as a reaction to new `props.data`.
			this.scrollComponent?.scrollHeight && this.scrollListener();
		}
	}

	render() {
		const { children, hasMore, loader, scrollElement, dataHook, className } =
			this.props;
		let ref;

		if (scrollElement) {
			ref = () => (this.scrollComponent = scrollElement);
		} else {
			ref = (node) => (this.scrollComponent = node);
		}

		return React.createElement(
			"div",
			{ ref, "data-hook": dataHook, className },
			children,
			hasMore && (loader || this._defaultLoader)
		);
	}

	calculateTopPosition(el: HTMLElement) {
		if (!el) return 0;
		return (
			el.offsetTop + this.calculateTopPosition(el.offsetParent as HTMLElement)
		);
	}

	scrollListener() {
		const el = this.scrollComponent;
		if (el) {
			let offset = 0;

			if (this.props.scrollElement) {
				if (this.props.isReverse) {
					offset = el.scrollTop;
				} else {
					offset = el.scrollHeight - el.scrollTop - el.clientHeight;
				}
			} else if (this.props.useWindow) {
				const scrollTop =
					window.pageYOffset !== undefined
						? window.pageYOffset
						: (
								document.documentElement ||
								document.body.parentNode ||
								document.body
						  ).scrollTop;
				if (this.props.isReverse) {
					offset = scrollTop;
				} else {
					offset =
						this.calculateTopPosition(el) +
						el.offsetHeight -
						scrollTop -
						window.innerHeight;
				}
			} else if (this.props.isReverse) {
				offset = (el.parentNode as HTMLElement).scrollTop || 0;
			} else {
				offset =
					el.scrollHeight -
					(el.parentNode as HTMLElement).scrollTop -
					(el.parentNode as HTMLElement).clientHeight;
			}

			if (offset < Number(this.props.threshold)) {
				this.detachScrollListener();
				// Call loadMore after detachScrollListener to allow for non-async loadMore functions
				if (typeof this.props.loadMore === "function" && this.props.hasMore) {
					this.props.loadMore((this.pageLoaded += 1));
				}
			}
		}
	}

	attachScrollListener() {
		if (this.scrollComponent) {
			this.detachScrollListener();

			if (!this.props.hasMore) {
				return;
			}

			let scrollEl: (Window & typeof globalThis) | HTMLDivElement | ParentNode =
				window;
			if (this.props.scrollElement) {
				scrollEl = this.scrollComponent;
			} else if (this.props.useWindow === false) {
				scrollEl = this.scrollComponent.parentNode!;
			}

			scrollEl.addEventListener("scroll", this.scrollListener);
			scrollEl.addEventListener("resize", this.scrollListener);

			this.detachScrollListener = () => {
				scrollEl.removeEventListener("scroll", this.scrollListener);
				scrollEl.removeEventListener("resize", this.scrollListener);
				this.detachScrollListener = () => {};
			};
		}
	}

	detachScrollListener = () => {};

	componentWillUnmount() {
		this.detachScrollListener();
	}

	// Set a default loader for all your `InfiniteScroll` components
	setDefaultLoader(loader: React.ReactElement) {
		this._defaultLoader = loader;
	}
}
