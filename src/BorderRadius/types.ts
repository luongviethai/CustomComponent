import type { BaseProps as NumberInputProps } from "./Number";

import type {
	POSITION_BOTTOM_LEFT,
	POSITION_BOTTOM_RIGHT,
	POSITION_TOP_LEFT,
	POSITION_TOP_RIGHT,
} from "./constants";

export type Position =
	| typeof POSITION_BOTTOM_LEFT
	| typeof POSITION_BOTTOM_RIGHT
	| typeof POSITION_TOP_LEFT
	| typeof POSITION_TOP_RIGHT;

export type Value = {
	[POSITION_BOTTOM_LEFT]?: string;
	[POSITION_BOTTOM_RIGHT]?: string;
	[POSITION_TOP_LEFT]?: string;
	[POSITION_TOP_RIGHT]?: string;
	linked?: boolean;
};

export type BaseProps = {
	allowedUnits?: NumberInputProps["allowedUnits"];
	numberProps?: Partial<
		Omit<
			NumberInputProps,
			| "className"
			| "dataHook"
			| "disabled"
			| "readOnly"
			| "setValue"
			| "size"
			| "value"
		>
	>;
};

export type OrdinaryProps = {
	defaultUnit?: string;
	defaultValue?: string;
	disabled?: boolean;
	readOnly?: boolean;
};
