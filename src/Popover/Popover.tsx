import React from "react";
import { Popover as CorePopover } from "../ui-core/popover";
import requestAnimationFramePolyfill from "./utils/request-animation-frame";

import { ThemeProviderConsumerBackwardCompatible } from "../ThemeProvider/ThemeProviderConsumerBackwardCompatible";
import { st, classes } from "./Popover.st.css";
import { placements } from "./constants";
import type { PopoverProps } from "./types";

export { placements };

/**
 *  This has been added in order to fix jsdom not having requestAnimation frame
 *  installed. Jest by default has this polyfilled, but mocha fails on it.
 *  Decided with Shlomi to get rid of this on next major version 7, where we will support
 *  only jest.
 */
if (process.env.NODE_ENV === "test") {
	requestAnimationFramePolyfill.install();
}

const ANIMATION_ENTER = 150;
const ANIMATION_EXIT = 100;

class Popover extends React.Component<PopoverProps> {
	static displayName = "Popover";

	static Element = CorePopover.Element;
	static Content = CorePopover.Content;

	static defaultProps = {
		appendTo: "parent",
		animate: false,
		shown: false,
	};

	render() {
		const {
			dataHook,
			animate,
			theme,
			className,
			shown = false,
			...rest
		} = this.props;

		const timeout = animate
			? { enter: ANIMATION_ENTER, exit: ANIMATION_EXIT }
			: undefined;

		return (
			<ThemeProviderConsumerBackwardCompatible>
				{({ className: themeClassName }) => (
					<CorePopover
						shown={shown}
						disableClickOutsideWhenClosed
						timeout={timeout}
						data-hook={dataHook}
						{...rest}
						className={st(classes.root, { theme }, className, themeClassName)}
					/>
				)}
			</ThemeProviderConsumerBackwardCompatible>
		);
	}
}

export default Popover;
