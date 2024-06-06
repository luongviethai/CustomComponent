import _ from "lodash";

import { memo, useCallback, useRef } from "react";
import { Box } from "@wix/design-system";
import NumberInput, { type BaseProps as NumberInputProps } from "./Number";
import Linked from "./Linked";
import {
	POSITION_BOTTOM_LEFT,
	POSITION_BOTTOM_RIGHT,
	POSITION_TOP_LEFT,
	POSITION_TOP_RIGHT,
	defaultAllowedUnits,
} from "./constants";
import type { BaseProps, OrdinaryProps, Position, Value } from "./types";

import { classes, st } from "./BorderRadius.st.css";

export type BorderRadiusProps = BaseProps &
	OrdinaryProps & {
		className?: string;
		dataHook?: string;
		setValue?: (value: Value) => void;
		value?: Value;
	};

const BorderRadius = (props: BorderRadiusProps) => {
	const {
		allowedUnits = defaultAllowedUnits,
		className,
		dataHook,
		defaultUnit = "px",
		defaultValue,
		disabled = false,
		numberProps,
		readOnly = false,
		setValue,
		value = {},
	} = props;

	const checkLastUpdate = useCallback(() => {
		if (!_.isEmpty(_.get(value, POSITION_TOP_LEFT))) {
			return POSITION_TOP_LEFT;
		}
		if (!_.isEmpty(_.get(value, POSITION_TOP_RIGHT))) {
			return POSITION_TOP_RIGHT;
		}
		if (!_.isEmpty(_.get(value, POSITION_BOTTOM_LEFT))) {
			return POSITION_BOTTOM_LEFT;
		}
		if (!_.isEmpty(_.get(value, POSITION_BOTTOM_RIGHT))) {
			return POSITION_BOTTOM_RIGHT;
		}

		return POSITION_TOP_LEFT;
	}, [value]);

	const lastUpdated = useRef(checkLastUpdate());

	const isLinked = () => !!_.get(value, "linked");

	const updateValue = (newValue: Value) =>
		_.isFunction(setValue) &&
		setValue({
			...newValue,
			...(_.get(newValue, "linked") && {
				[POSITION_TOP_LEFT]: _.get(newValue, [lastUpdated.current]),
				[POSITION_TOP_RIGHT]: _.get(newValue, [lastUpdated.current]),
				[POSITION_BOTTOM_LEFT]: _.get(newValue, [lastUpdated.current]),
				[POSITION_BOTTOM_RIGHT]: _.get(newValue, [lastUpdated.current]),
			}),
		});

	const handleOnClickLinked = () =>
		updateValue({
			...value,
			linked: !isLinked(),
		});

	const handleOnchangeValue = (
		newValue: NumberInputProps["value"],
		position: Position
	) => {
		lastUpdated.current = position;
		updateValue({
			...value,
			[position]: newValue,
		});
	};

	const renderNumber = (position: Position) => {
		const props: Partial<NumberInputProps> = {
			allowedUnits,
			...numberProps,
		};

		return (
			<NumberInput
				{...props}
				showSpinner
				className={classes.input}
				dataHook={`${position}-number`}
				defaultUnit={defaultUnit}
				defaultValue={defaultValue || "0px"}
				disabled={disabled}
				max={9999999999}
				min={0}
				readOnly={readOnly}
				setValue={(value) => handleOnchangeValue(value, position)}
				size="medium"
				value={_.get(value, position)}
			/>
		);
	};

	return (
		<Box
			className={st(classes.root, { disabled, readOnly }, className)}
			dataHook={dataHook}
			direction="vertical"
			gap="12px"
			width="100%"
		>
			<Box direction="horizontal" verticalAlign="space-between">
				<Box className={classes.paddingItem}>{renderNumber("top_left")}</Box>
				<Box className={classes.paddingItem}>{renderNumber("top_right")}</Box>
			</Box>
			<Box className={classes.previewWrapper} verticalAlign="middle">
				<Box
					borderTopLeftRadius={_.get(value, POSITION_TOP_LEFT)}
					borderTopRightRadius={_.get(value, POSITION_TOP_RIGHT)}
					borderBottomLeftRadius={_.get(value, POSITION_BOTTOM_LEFT)}
					borderBottomRightRadius={_.get(value, POSITION_BOTTOM_RIGHT)}
					align="center"
					className={classes.preview}
					verticalAlign="middle"
					width="100%"
				>
					<Linked
						className={classes.link}
						disabled={disabled || readOnly}
						isLinked={isLinked()}
						onClick={handleOnClickLinked}
					/>
				</Box>
			</Box>
			<Box direction="horizontal" verticalAlign="space-between" width="100%">
				<Box className={classes.paddingItem}>{renderNumber("bottom_left")}</Box>
				<Box className={classes.paddingItem}>
					{renderNumber("bottom_right")}
				</Box>
			</Box>
		</Box>
	);
};

export default memo(BorderRadius);
