import type { InputProps } from "@wix/design-system";

export type Value = number | string;

export type BaseProps = {
	allowedUnits?: string[];
	allowedValues?: string[];
	compareValues?: { [value: string]: Value };
	defaultUnit?: string;
	defaultValue?: Value;
	dynamic?: boolean;
	hideStepper?: boolean;
	inputPrefix?: string;
	inputSuffix?: string;
	max?: number;
	min?: number;
	placeholder?: string;
	round?: number;
	showSpinner?: boolean;
	size?: InputProps["size"];
	step?: number;
	subLabel?: string;
};
