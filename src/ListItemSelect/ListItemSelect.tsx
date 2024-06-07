import React from "react";
// import Text, { TextProps } from "../Text";
// import Checkbox from "../Checkbox";
// import Box from "../Box";
import HighlightContext from "../InputWithOptions/HighlightContext";
// import Highlighter from "../Highlighter/Highlighter";
import {
	Text,
	Checkbox,
	Box,
	Highlighter,
	type TextProps,
} from "@wix/design-system";
import { dataHooks } from "./constants";
import { st, classes } from "./ListItemSelect.st.css";
import type { ListItemSelectProps, ListItemSelectSizes } from "./types";

export const SIZES: Record<string, TextProps["size"]> = {
	small: "small",
	medium: "medium",
};

class ListItemSelect extends React.PureComponent<ListItemSelectProps> {
	static displayName = "ListItemSelect";
	static defaultProps = {
		checkbox: false,
		selected: false,
		highlighted: false,
		ellipsis: false,
		size: SIZES.medium,
		dataHook: "list-item-select",
	};

	render() {
		const {
			dataHook,
			className,
			checkbox,
			selected,
			highlighted,
			disabled,
			onClick,
			size,
		} = this.props;

		return (
			<div
				className={st(
					classes.root,
					{ checkbox, selected, highlighted, disabled },
					className
				)}
				data-hook={dataHook}
				data-selected={selected}
				onClick={disabled ? undefined : onClick}
			>
				{checkbox ? (
					<Checkbox
						dataHook={dataHooks.CHECKBOX}
						className={classes.fullWidthContent}
						size={size}
						checked={selected}
						disabled={disabled}
					>
						{this._renderContent()}
					</Checkbox>
				) : (
					this._renderContent()
				)}
			</div>
		);
	}

	_renderTitle(textProps) {
		const { title } = this.props;
		const titleElement = (
			<Text className={classes.title} dataHook={dataHooks.TITLE} {...textProps}>
				{title}
			</Text>
		);
		return (
			<HighlightContext.Consumer>
				{({ highlight, match }) =>
					highlight ? (
						<Highlighter match={match}>{titleElement}</Highlighter>
					) : (
						titleElement
					)
				}
			</HighlightContext.Consumer>
		);
	}

	_renderContent() {
		const {
			checkbox,
			prefix,
			subtitle,
			suffix,
			selected,
			disabled,
			size,
			ellipsis,
		} = this.props;

		const textProps: TextProps = {
			tagName: "div",
			size,
			ellipsis,
			showDelay: 300,
			skin: disabled ? "disabled" : "standard",
			weight: "thin",
			light: selected && !checkbox,
		};

		const secondaryTextProps = {
			...textProps,
			light: !disabled,
			secondary: !selected || checkbox,
		};

		return (
			<Box width="100%" className={classes.textsWrapper}>
				{prefix && (
					<Text
						className={st(classes.prefix, {
							subtitle: Boolean(subtitle),
						})}
						dataHook={dataHooks.PREFIX}
						{...textProps}
						ellipsis={false}
					>
						{prefix}
					</Text>
				)}
				<div
					className={st(classes.titleWrapper, { subtitle: Boolean(subtitle) })}
				>
					{this._renderTitle(textProps)}
					{subtitle && (
						<Text
							className={classes.subtitle}
							dataHook={dataHooks.SUBTITLE}
							{...secondaryTextProps}
							secondary
							size={SIZES.small}
						>
							{subtitle}
						</Text>
					)}
				</div>
				{suffix && (
					<Text
						dataHook={dataHooks.SUFFIX}
						className={classes.suffix}
						{...secondaryTextProps}
					>
						{suffix}
					</Text>
				)}
			</Box>
		);
	}
}

export default ListItemSelect;

type ListItemSelectBuilderProps = {
	id: string | number;
	className?: string;
	checkbox?: boolean;
	prefix?: React.ReactNode;
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	suffix?: React.ReactNode;
	selected?: boolean;
	disabled?: boolean;
	size?: ListItemSelectSizes;
	ellipsis?: boolean;
	dataHook?: string;
	label?: string;
};

export const listItemSelectBuilder = ({
	id,
	className,
	checkbox,
	prefix,
	title,
	label,
	subtitle,
	suffix,
	disabled,
	size,
	ellipsis,
	dataHook,
}: ListItemSelectBuilderProps): {
	id: string | number;
	disabled: boolean | undefined;
	overrideOptionStyle: true;
	label: string | undefined;
	value: (
		props: Partial<ListItemSelectProps & { hovered: boolean }>
	) => React.ReactNode;
} => ({
	id,
	disabled,
	overrideOptionStyle: true,
	label,
	value: ({ selected, hovered, ...rest }) => (
		<ListItemSelect
			dataHook={dataHook}
			className={className}
			checkbox={checkbox}
			prefix={prefix}
			title={title}
			subtitle={subtitle}
			suffix={suffix}
			size={size}
			ellipsis={ellipsis}
			selected={selected}
			highlighted={hovered}
			{...rest}
		/>
	),
});
