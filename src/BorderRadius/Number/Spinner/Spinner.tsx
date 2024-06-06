import _ from "lodash";

import { Draggable } from "../Draggable";
import { memo, useRef } from "react";
import { Text } from "@wix/design-system";
import $ from "jquery";
import { ROUND_NUMBER } from "../constants";

import { LIMIT_TRANSFORM } from "./constants";
import { classes, st } from "./Spinner.st.css";

import type { Value } from "..";

export type SpinnerProps = {
	className?: string;
	dataHook?: string;
	disabled?: boolean;
	dynamic?: boolean;
	label?: string;
	max?: number;
	min?: number;
	setIsDragging?: (value: boolean) => void;
	setValue: (value: number) => void;
	step?: number;
	value?: Value;
};

function Spinner(props: SpinnerProps) {
	const {
		className,
		disabled = false,
		dynamic = false,
		label,
		max,
		min,
		setIsDragging,
		setValue,
		step = 1,
		value,
	} = props;
	const transform = useRef(LIMIT_TRANSFORM);

	const handleDragEnd = () => {
		_.isFunction(setIsDragging) && setIsDragging(false);
		transform.current = LIMIT_TRANSFORM;
		$(`html`).removeClass("mb-dragme-noselect x");
	};

	const handleDrag = (x: number) => {
		$(`html`).addClass("mb-dragme-noselect x");
		_.isFunction(setIsDragging) && setIsDragging(true);
		setValue(
			Math.round((_.toNumber(value) + x * step) * ROUND_NUMBER) / ROUND_NUMBER
		);
		transform.current = LIMIT_TRANSFORM - x;
	};

	const renderSpinner = () =>
		!disabled && (
			<Draggable
				className={classes.spinnerControl}
				onDrag={handleDrag}
				onDragEnd={handleDragEnd}
			>
				<div className={classes.spinner}>
					<div
						style={{
							transform: `translateX(${
								dynamic &&
								(_.toNumber(value) === min || _.toNumber(value) === max)
									? -LIMIT_TRANSFORM
									: -transform.current
							}px)`,
						}}
						className={classes.spinnerItem}
					/>
				</div>
			</Draggable>
		);

	const renderLabel = () => (
		<Text
			className={classes.label}
			size="tiny"
			skin={disabled ? "disabled" : undefined}
			tagName="div"
		>
			{label}
		</Text>
	);

	return (
		<div className={st(classes.root, className)} data-disabled={disabled}>
			{renderSpinner()}
			{renderLabel()}
		</div>
	);
}

export default memo(Spinner);
