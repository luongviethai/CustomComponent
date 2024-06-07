import React from "react";
import type { Required, $Keys } from "utility-types";
import { Divider, Text, TextButton } from "@wix/design-system";
// import Divider from "../Divider";
// import Text, { WEIGHTS } from "../Text";
// import TextButton from "../TextButton";
// import { isString } from "../utils/StringUtils";
import { WixStyleReactContext } from "../WixStyleReactProvider/context";
import { dataHooks } from "./constants";
import { st, classes } from "./ListItemSection.st.css";
import type {
	ListItemSectionProps as ListItemSectionPropsCore,
	ListItemSectionTypes,
	OptionRender,
} from "./types";

export const TYPES = {
	WHITESPACE: "whitespace",
	DIVIDER: "divider",
	TITLE: "title",
	SUBHEADER: "subheader",
};

const defaultProps = {
	type: TYPES.TITLE,
	ellipsis: false,
	dataHook: "list-item-section",
};

const WEIGHTS = {
	thin: "thin",
	normal: "normal",
	bold: "bold",
};

type ListItemSectionProps = Required<
	ListItemSectionPropsCore,
	$Keys<typeof defaultProps>
>;

export const isString = (a) => typeof a === "string";

class ListItemSection extends React.PureComponent<ListItemSectionProps> {
	static displayName = "ListItemSection";
	static defaultProps = defaultProps;

	render() {
		const { type } = this.props;

		if (type === TYPES.WHITESPACE) return this._renderDivisionElements();

		if (type === TYPES.DIVIDER)
			return this._renderDivisionElements(<Divider />);

		return this._renderTitle();
	}

	_renderDivisionElements = (children?: React.ReactNode) => {
		const { dataHook, type } = this.props;
		return (
			<div
				className={st(classes.root, { [type]: true })}
				data-hook={dataHook}
				onClick={(e) => e.stopPropagation()}
				children={children}
			/>
		);
	};

	_renderSuffix = () => {
		const { suffix, onClick, ellipsis } = this.props;

		return isString(suffix) ? (
			<div className={classes.suffixWrapper}>
				<TextButton
					ellipsis={ellipsis}
					dataHook={dataHooks.SUFFIX}
					size="tiny"
					onClick={onClick}
					className={classes.suffix}
				>
					{suffix}
				</TextButton>
			</div>
		) : (
			<div
				data-hook={dataHooks.SUFFIX}
				className={classes.suffixWrapper}
				onClick={onClick}
			>
				{suffix}
			</div>
		);
	};

	_renderTitle = () => {
		const { dataHook, className, type, title, suffix, ellipsis } = this.props;
		const isSubheader = type === TYPES.SUBHEADER;
		const getTextWeight = (newColorsBranding?: boolean) => {
			if (!newColorsBranding && !type) {
				return WEIGHTS.thin;
			}

			return isSubheader ? WEIGHTS.normal : WEIGHTS.bold;
		};

		return (
			<WixStyleReactContext.Consumer>
				{({ newColorsBranding }) => (
					<div
						className={st(
							classes.root,
							{
								subheader: isSubheader,
								ellipsis,
								suffix: !!suffix,
								newColorsBranding,
							},
							className
						)}
						data-hook={dataHook}
					>
						{/* Text */}
						<div className={classes.titleWrapper}>
							<Text
								dataHook={dataHooks.TITLE}
								tagName="div"
								size="small"
								className={classes.title}
								ellipsis={ellipsis}
								tooltipProps={{
									enterDelay: 300,
								}}
								weight={getTextWeight(newColorsBranding)}
							>
								{title}
							</Text>
						</div>

						{/* Suffix */}
						{suffix && this._renderSuffix()}
					</div>
				)}
			</WixStyleReactContext.Consumer>
		);
	};
}

export default ListItemSection;

export type ListItemSectionBuilderProps = {
	id: string | number;
	className?: string;
	type?: ListItemSectionTypes;
	title?: React.ReactNode | string;
	suffix?: React.ReactNode;
	ellipsis?: boolean;
	dataHook?: string;
};

export const listItemSectionBuilder = ({
	id,
	className,
	dataHook,
	type,
	title,
	suffix,
	ellipsis,
}: ListItemSectionBuilderProps): OptionRender => ({
	id,
	overrideOptionStyle: true,
	disabled: true,
	value: (props: Partial<ListItemSectionProps>) => (
		<ListItemSection
			className={className}
			dataHook={dataHook}
			type={type}
			title={title}
			suffix={suffix}
			ellipsis={ellipsis}
			{...props}
		/>
	),
});
