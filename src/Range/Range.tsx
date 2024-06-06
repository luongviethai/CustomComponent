import { memo } from "react";
import {
	Box,
	NumberInput,
	type NumberInputProps,
	Slider,
	type SliderProps,
} from "@wix/design-system";

import { dataHooks } from "./constants";

import { classes, st } from "./Range.st.css";

import type { BaseProps, Value } from "./types";

export type ControlProps = BaseProps & {
	setValue: (value: Value) => void;
	value?: Value;
};

const Range = (props: ControlProps) => {
	const {
		disabled,
		id,
		inputProps,
		max = 100,
		min = 0,
		placeholder,
		setValue,
		sliderProps,
		step,
		value = 0,
	} = props;

	return (
		<Box gap="12px" verticalAlign="middle">
			<Slider
				{...sliderProps}
				className={st(classes.slider, sliderProps?.className)}
				dataHook={dataHooks.slider}
				disabled={disabled}
				displayMarks={false}
				max={max}
				min={min}
				step={step}
				value={value}
				onChange={setValue as SliderProps["onChange"]}
			/>
			<NumberInput
				className={st(classes.numberInput, inputProps?.className)}
				dataHook={dataHooks.numberInput}
				disabled={disabled}
				id={id}
				max={max}
				min={min}
				placeholder={placeholder}
				step={step}
				value={value}
				onChange={setValue as NumberInputProps["onChange"]}
			/>
		</Box>
	);
};

export default memo(Range);
