import type { PreviewProps } from "./Preview";

export type ColorPickerColor = {
	code?: string;
	groupId?: string;
	id?: string;
	name?: string;
};

export type ColorPickerGroup = {
	colors: ColorPickerColor[];
	editable?: boolean;
	id: "global" | "preset" | "recent";
	modal?: {
		content: string;
		primaryButtonText: string;
		secondaryButtonText: string;
		title: string;
	};
	name: string;
};

export type ColorPickerValue = ColorPickerColor;

export type ValueColors = {
	color?: string;
	hex?: string;
	hsl?: { a: number; h: number; l: number; s: number };
	hsv?: { a: number; h: number; s: number; v: number };
	oldHue?: number;
	rgb?: { a: number; b: number; g: number; r: number };
	source?: string;
};

export type CommonProps = {
	className?: string;
	containerEl?: string;
	dataHook?: string;
	default?: ColorPickerValue;
	disabled?: boolean;
	groups?: ColorPickerGroup[];
	hightlightColors?: ColorPickerColor[];
	id?: string;
	isAlpha?: boolean;
	isShowGroups?: boolean;
	isShowHighlightColor?: boolean;
	previewPicker?: boolean;
	previewProps?: Pick<
		PreviewProps,
		"id" | "onClickDeleteButton" | "onClickEditButton" | "onClickResetButton"
	>;
	showPicker?: boolean;
	value?: ColorPickerValue;
};
