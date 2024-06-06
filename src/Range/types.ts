import type { NumberInputProps, SliderProps } from "@wix/design-system";

export type Value = number;

export type BaseProps = Pick<SliderProps, "id" | "max" | "min" | "step"> & {
	dataHook?: string;
	disabled?: boolean;
	inputProps?: Omit<
		NumberInputProps,
		| "disabled"
		| "id"
		| "max"
		| "min"
		| "onChange"
		| "placeholder"
		| "step"
		| "value"
	>;
	placeholder?: NumberInputProps["placeholder"];
	sliderProps?: Omit<
		SliderProps,
		"disabled" | "displayMarks" | "max" | "min" | "onChange" | "step" | "value"
	>;
};
