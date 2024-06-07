import {
	IconFormFieldError,
	IconFormFieldErrorSmall,
	IconToggleOn,
	IconCircleLoaderCheck,
	IconCircleLoaderCheckSmall,
} from "../Icons";

export const ARCS_ANGLES = {
	tiny: {
		light: 216,
		dark: 144,
	},
	small: {
		light: 216,
		dark: 144,
	},
	medium: {
		light: 108,
		dark: 108,
	},
	large: {
		light: 180,
		dark: 180,
	},
};

export const STROKE_WIDTHS = {
	tiny: 3,
	small: 4,
	medium: 4,
	large: 4,
};

export const SIZES_IN_PIXEL = {
	tiny: 18,
	small: 30,
	medium: 54,
	large: 102,
};

export const FULL_CIRCLE_ANGLE = 359;

export const SIZE_TO_SUCCESS_ICON = {
	tiny: <IconToggleOn />,
	small: <IconCircleLoaderCheckSmall />,
	medium: <IconCircleLoaderCheck />,
	large: <IconCircleLoaderCheck />,
};

export const SIZE_TO_ERROR_ICON = {
	tiny: <IconFormFieldError />,
	small: <IconFormFieldErrorSmall />,
	medium: <IconFormFieldError />,
	large: <IconFormFieldError />,
};
