import { ThemeContext } from "./ThemeContext";
import type { ThemeInterface } from "./types";

/**
 * This is a utility for every component that uses an icon to declare its defaults but also replace it with the theme context
 * Usage Example:
 *
 * <ThemeProviderConsumerBackwardCompatible
 *   defaultIcons={{
 *     CloseButton: CloseIcon,
 *   }}
 * >
 *   {({ icons }) => {
 *      const CloseIcon = icons.CloseButton
 *      return <CloseIcon data-hook="additional-content"/>
 *     }
 *   }
 * </ThemeProviderConsumerBackwardCompatible>
 *
 * Note that this implementation is temporary and needed only to preserve backwards compatability for components with built-in icons (like CloseButton).
 * It will be removed in the future once a <ThemeProvider/> will be required on the top of any theme, including the default one.
 * This will assist in creating smaller bundle size for themes that would override the default icons. */
export const ThemeProviderConsumerBackwardCompatible = ({
	defaultIcons = {},
	children,
	...rest
}) => (
	<ThemeContext.Consumer>
		{(context) => (
			<ThemeContext.Provider
				value={{
					icons: {
						...defaultIcons,
						...(context && context.icons),
					} as ThemeInterface["icons"],
					className: context && context.className,
				}}
			>
				<ThemeContext.Consumer {...rest}>{children}</ThemeContext.Consumer>
			</ThemeContext.Provider>
		)}
	</ThemeContext.Consumer>
);
