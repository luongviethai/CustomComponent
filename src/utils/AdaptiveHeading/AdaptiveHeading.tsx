import React from "react";
// import Heading from "../../Heading";
// import Text from "../../Text";
// import Tooltip from "../../Tooltip";
import { Heading, Text, Tooltip } from "@wix/design-system";
import dataHooks from "./dataHooks";
import { st, classes } from "./AdaptiveHeading.st.css";
import { APPEARANCES } from "./constants";

const appearanceToComponent = {
	[APPEARANCES.H1]: Heading,
	[APPEARANCES.H2]: Heading,
	[APPEARANCES.H3]: Heading,
	[APPEARANCES.H4]: Heading,
	[APPEARANCES.H5]: Heading,
	[APPEARANCES.H6]: Heading,
	[APPEARANCES.tiny]: Text,
};

const appearanceToSizingProps = {
	[APPEARANCES.H1]: { appearance: "H1" },
	[APPEARANCES.H2]: { appearance: "H2" },
	[APPEARANCES.H3]: { appearance: "H3" },
	[APPEARANCES.H4]: { appearance: "H4" },
	[APPEARANCES.H5]: { appearance: "H5" },
	[APPEARANCES.H6]: { appearance: "H6" },
	[APPEARANCES.tiny]: { size: "medium", weight: "bold" },
};

export type AdaptiveHeadingProps = {
	dataHook?: string;

	/** Usual (long) version of header*/
	text: string;

	/** Short version text */
	textInShort?: string;

	/** H1-H6 to create a Heading component, or "tiny" for a bold Text component  */
	appearance?: (typeof APPEARANCES)[keyof typeof APPEARANCES];

	/** Use light theme */
	light?: boolean;

	/** Render empty content when there is not enough space for short text */
	emptyLast?: boolean;
};

class AdaptiveHeading extends React.PureComponent<AdaptiveHeadingProps> {
	static displayName = "AdaptiveHeading";

	render() {
		const {
			dataHook,
			text,
			appearance = "H1",
			light,
			emptyLast,
			textInShort,
		} = this.props;

		const Component = appearanceToComponent[appearance];
		const sizingProps = appearanceToSizingProps[appearance];

		if (!textInShort) {
			if (emptyLast) {
				return (
					<Component
						{...sizingProps}
						className={st(classes.headerWrapper, { appearance })}
						dataHook={dataHook}
						light={light}
					>
						<span className={classes.headerShort}>&nbsp;</span>
						<span data-hook={dataHooks.text} className={classes.headerFull}>
							{text}
						</span>
					</Component>
				);
			}

			return (
				<Component {...sizingProps} dataHook={dataHook} light={light} ellipsis>
					<span data-hook={dataHooks.text}>{text}</span>
				</Component>
			);
		}

		if (emptyLast) {
			return (
				<Component
					className={st(classes.headerWrapper, { appearance })}
					dataHook={dataHook}
					appearance={appearance}
					light={light}
				>
					<div className={classes.headerShort}>
						<div
							aria-hidden="true"
							className={st(classes.headerWrapper, { appearance })}
						>
							<span className={classes.headerShort}>&nbsp;</span>
							<span
								className={classes.headerFull}
								data-hook={dataHooks.textInShort}
								title={text}
							>
								{textInShort}
							</span>
						</div>
					</div>
					<span data-hook={dataHooks.text} className={classes.headerFull}>
						{text}
					</span>
				</Component>
			);
		}

		return (
			<Component
				{...sizingProps}
				className={st(classes.headerWrapper, { appearance })}
				dataHook={dataHook}
				light={light}
			>
				<div className={classes.headerShort}>
					<span
						data-hook={dataHooks.textInShort}
						aria-hidden="true"
						title={text}
					>
						<Tooltip content={text}>
							<div className={classes.ellipsis}>{textInShort}</div>
						</Tooltip>
					</span>
				</div>
				<span data-hook={dataHooks.text} className={classes.headerFull}>
					{text}
				</span>
			</Component>
		);
	}
}

export default AdaptiveHeading;
