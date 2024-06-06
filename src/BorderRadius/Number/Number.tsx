import {
	type MouseEvent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from "react";
import _ from "lodash";

import { getCssUnit, getNumber } from "./helpers";
import { Input, type InputProps } from "@wix/design-system";

import {
	dataHooks,
	DECREASE,
	INCREASE,
	type KeyEvent,
	keyEvent,
	ROUND_NUMBER,
	TYPE_NUMBER,
	TYPE_TEXT,
} from "./constants";
import Spinner from "./Spinner";

import { classes, st } from "./Number.st.css";

import type { BaseProps, Value } from "./types";

export type ControlProps = BaseProps & {
	className?: string;
	dataHook?: string;
	disabled?: boolean;
	readOnly?: boolean;
	setValue?: (value: Value) => void;
	status?: InputProps["status"];
	statusMessage?: string;
	value?: Value;
};

export const Control = (props: ControlProps) => {
	const {
		className,
		compareValues = {},
		defaultUnit = "",
		defaultValue = "",
		disabled,
		dynamic,
		hideStepper,
		inputPrefix: prefix,
		inputSuffix: suffix,
		readOnly,
		round,
		setValue,
		showSpinner,
		size,
		status,
		statusMessage,
		step = 1,
		subLabel,
	} = props;

	const allowedValues = useMemo(
		() => [..._.keys(props.compareValues), ...(props.allowedValues || [])],
		[props.allowedValues, props.compareValues]
	);
	const allowedUnits = useMemo(
		() => [...(props.allowedUnits || []), ...(defaultUnit && [defaultUnit])],
		[props.allowedUnits, defaultUnit]
	);

	const inputType =
		_.isEmpty(allowedUnits) &&
		_.isEmpty(allowedValues) &&
		_.isEmpty(defaultUnit)
			? TYPE_NUMBER
			: TYPE_TEXT;

	/**
	 * Format to valid value
	 */
	const getUnit = useCallback(
		(value) =>
			getCssUnit({
				value,
				allowedUnits,
				defaultUnit,
				allowedValues,
			}),
		[allowedUnits, defaultUnit, allowedValues]
	);

	const [max, setMax] = useState<number>(_.get(props, "max", 100));
	const [min, setMin] = useState<number>(_.get(props, "min", 0));
	const [spinner, setSpinner] = useState<boolean>(false);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const isLeaveWrap = useRef<boolean>(true);
	const value = getUnit(props.value)?.text || defaultValue;
	const refNumber = useRef<HTMLDivElement>(null);
	const inputRef = useRef(value);
	const suffixRef = useRef<string>(getUnit(value)?.unit || defaultUnit);
	const updateTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const pressTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const typingRef = useRef(false);
	const rangeRef = useRef<Input>(null);
	const forceUpdate = useReducer(() => ({}), {})[1];

	/**
	 * Format value to text and number validity
	 *
	 * @param {string | number} value
	 */
	const getValidInputValue = useCallback(
		(value: Value) => {
			const getValueByDefault = (_value: Value) =>
				_value === defaultValue ||
				(inputType === TYPE_NUMBER &&
					getNumber(_value) === getNumber(defaultValue))
					? ""
					: _value;

			let newValue = getValueByDefault(value);
			let number = getNumber(value, min);

			if (!_.isEmpty(allowedValues)) {
				if (_.includes(allowedValues, value)) {
					number =
						!_.isEmpty(compareValues) && compareValues[value]
							? getNumber(compareValues[value], min)
							: max;
				}
				if (_.includes(compareValues, value)) {
					const key = _.findKey(compareValues, (_value) => _value === newValue);
					if (!_.isNil(key) && _.includes(allowedValues, key)) {
						newValue = getValueByDefault(key);
					}
				}
			}

			return {
				text: _.toString(newValue),
				number: !_.isNull(number) ? getNumber(number) : null,
			};
		},
		[allowedValues, compareValues, inputType, max, min, defaultValue]
	);

	/**
	 * Return text, number validity
	 */
	const getValue = useCallback(() => {
		if (typingRef.current) {
			return { text: inputRef.current, number: getNumber(inputRef.current) };
		}
		return getValidInputValue(value);
	}, [getValidInputValue, value]);

	/**
	 * Update suffix when value of input changed
	 *
	 * @param {string | number} value input value
	 */
	const updateSuffix = (value: Value) => {
		const unit = getUnit(value || 0);
		suffixRef.current = unit?.unit || "";
	};

	/**
	 * Format input value to validity value
	 *
	 * @param {string | number} value
	 */
	const prepareValueToSave = (value: Value) => {
		let newValue = value;

		if (_.includes(allowedValues, value)) {
			if (_.has(compareValues, value)) {
				newValue = compareValues[value];
				updateSuffix(newValue);
			}
		} else {
			let inputValue = getNumber(newValue);

			if (_.isNull(inputValue)) {
				newValue = _.isString(defaultValue)
					? _.toString(defaultValue)
					: _.toNumber(defaultValue);
				updateSuffix(newValue);
			} else if (!_.isEmpty(_.toString(newValue))) {
				inputValue = Math.min(inputValue, 9999999999);
				updateSuffix(newValue);
				if (dynamic) {
					let newMin = min;
					let newMax = max;
					if ((inputValue - min) % step) {
						newMin = inputValue - step * Math.round((inputValue - min) / step);
					}
					if ((max - inputValue) % step) {
						newMax = inputValue + step * Math.round((max - inputValue) / step);
					}

					setMin(Math.min(inputValue, newMin));
					setMax(Math.max(inputValue, newMax));
				} else {
					inputValue = Math.min(inputValue, max);
					inputValue = Math.max(inputValue, min);
				}
				const unit = getUnit(inputValue + suffixRef.current);
				if (unit) {
					newValue = unit.text;
				}
			}
		}
		return newValue;
	};

	/**
	 * Called setValue when value changed
	 *
	 * @param {string | number} value
	 */
	const handleSaveValue = (value: Value) => {
		if (rangeRef.current) {
			_.isFunction(setValue) && setValue(prepareValueToSave(value));
			forceUpdate();
		}
	};

	/**
	 * Force save current value
	 */
	const forceToSave = () => {
		if (inputRef.current !== getValidInputValue(value).text) {
			clearTimeout(updateTimeoutRef.current);
			typingRef.current = false;
			handleSaveValue(inputRef.current);
		}
	};

	/**
	 * Update suffix and await input changed
	 *
	 * @param {Object} e event
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		inputRef.current = newValue;
		typingRef.current = true;
		clearTimeout(updateTimeoutRef.current);
		updateTimeoutRef.current = setTimeout(() => {
			forceToSave();
		}, 1000);
		forceUpdate();
	};

	function naiveRound(num: number, decimalPlaces = 0) {
		const p = 10 ** decimalPlaces;
		return Math.round(num * p) / p;
	}

	/**
	 * Whenever Increase or Decrease called this function called too
	 *
	 * @param {boolean} isShiftKey
	 * @param {string}  type
	 */
	const handleMountStep = (
		isShiftKey: boolean,
		type: "decrease" | "increase"
	) => {
		let textInput = getValue().number;

		if (_.isNil(textInput)) {
			return;
		}

		textInput = round && round > 0 ? naiveRound(textInput, round) : textInput;

		if (isShiftKey) {
			textInput = type === INCREASE ? textInput + 10 : textInput - 10;
		} else {
			textInput =
				type === INCREASE
					? Math.round((textInput + step) * ROUND_NUMBER) / ROUND_NUMBER
					: Math.round((textInput - step) * ROUND_NUMBER) / ROUND_NUMBER;
		}

		if (!dynamic) {
			textInput = Math.max(Math.min(textInput, max), min);
		}
		if (round === 0) {
			textInput = Math.round(textInput);
			global(spinner - dragging);
		}

		handleSaveValue(
			suffixRef.current ? textInput + suffixRef.current : textInput
		);
	};

	/**
	 * Increase value
	 *
	 * @param {Object} e
	 */
	const handleIncrease = (e: MouseEvent) =>
		!disabled && !readOnly && handleMountStep(e.shiftKey, INCREASE);

	/**
	 * Decrease value
	 *
	 * @param {Object} e
	 */
	const handleDecrease = (e: MouseEvent) =>
		!disabled && !readOnly && handleMountStep(e.shiftKey, DECREASE);

	/**
	 * Handle Up / Down value when keyDown
	 *
	 * @param {Object} event
	 */
	const handleKeyDown = (
		event: MouseEvent & React.KeyboardEvent<HTMLInputElement>
	) => {
		const keyName: KeyEvent["ArrowDown"] | KeyEvent["ArrowUp"] =
			keyEvent[event.key];

		if (keyName) {
			event.preventDefault();
			if (typingRef.current) {
				forceToSave();
			} else if (rangeRef.current) {
				// eslint-disable-next-line consistent-return
				pressTimeoutRef.current = setTimeout(() => {
					if (keyName === "UpKey") {
						return handleIncrease(event);
					}
					if (keyName === "DownKey") {
						return handleDecrease(event);
					}
				}, 0);
			}
		}
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		inputRef.current = e.target.value;
		forceToSave();
	};

	const getPlaceholder = () =>
		props.placeholder ||
		(_.has(props, "defaultValue") && _.toString(defaultValue)) ||
		"";

	const handleChangeSpinner = (value: number) => {
		let textInput = value;

		if (_.isNil(textInput)) {
			return;
		}

		textInput = round && round > 0 ? naiveRound(textInput, round) : textInput;

		if (!dynamic) {
			textInput = Math.max(Math.min(textInput, max), min);
		}
		if (round === 0) {
			textInput = Math.round(textInput);
		}

		if (!readOnly && !disabled) {
			handleSaveValue(
				suffixRef.current ? textInput + suffixRef.current : textInput
			);
		}
	};

	useEffect(() => {
		if (!showSpinner) {
			return;
		}
		if (isLeaveWrap.current && !isDragging) {
			setSpinner(false);
		}
	}, [isDragging, showSpinner]);

	const onMouseEnter = () => {
		if (!showSpinner || disabled || readOnly) {
			return;
		}
		setSpinner(true);
		isLeaveWrap.current = false;
	};

	const onMouseLeave = () => {
		if (!showSpinner || disabled || readOnly) {
			return;
		}
		if (!isDragging && !isLeaveWrap.current) {
			setSpinner(false);
		}
		isLeaveWrap.current = true;
	};

	useEffect(() => {
		if (!showSpinner || disabled || readOnly) {
			return;
		}
		const mousemove = (e: globalThis.MouseEvent) => {
			if (refNumber.current) {
				e.preventDefault();
				const boundNumber = refNumber.current?.getBoundingClientRect();
				const { clientX } = e;
				const { clientY } = e;
				if (subLabel) {
					if (
						boundNumber &&
						boundNumber.x <= clientX &&
						clientX <= boundNumber.x + boundNumber.width &&
						boundNumber.y <= clientY &&
						clientY <= boundNumber.y + boundNumber.height
					) {
						isLeaveWrap.current = false;
					} else {
						isLeaveWrap.current = true;
					}
				} else if (
					boundNumber &&
					boundNumber.x <= clientX &&
					clientX <= boundNumber.x + boundNumber.width &&
					boundNumber.y <= clientY + 8 &&
					clientY <= boundNumber.y + boundNumber.height + 8
				) {
					isLeaveWrap.current = false;
				} else {
					isLeaveWrap.current = true;
				}
			}
		};
		document.addEventListener("mousemove", mousemove);

		// eslint-disable-next-line consistent-return
		return () => document.removeEventListener("mousemove", mousemove);
	}, [disabled, showSpinner, subLabel, readOnly]);

	return (
		<div
			ref={refNumber}
			className={st(
				classes.root,
				{ size, spinner: showSpinner && spinner, disabled, isDragging },
				className
			)}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<Input
				ref={rangeRef}
				suffix={
					<Input.Group>
						{suffix}
						{!hideStepper && (
							<Input.Ticker
								dataHook={dataHooks.ticker}
								downDisabled={!dynamic && _.toNumber(getValue().number) === min}
								upDisabled={!dynamic && _.toNumber(getValue().number) === max}
								onDown={handleDecrease}
								onUp={handleIncrease}
							/>
						)}
					</Input.Group>
				}
				dataHook={dataHooks.inputNumber}
				disabled={disabled}
				placeholder={getPlaceholder()}
				prefix={prefix && <Input.Affix>{prefix}</Input.Affix>}
				readOnly={readOnly}
				size={size}
				status={status}
				statusMessage={statusMessage}
				type={inputType}
				value={getValue().text}
				onBlur={handleBlur}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
			/>

			{showSpinner && (
				<Spinner
					className={classes.spinnerContainer}
					disabled={disabled || readOnly}
					dynamic={dynamic}
					label={subLabel}
					max={max}
					min={min}
					setIsDragging={setIsDragging}
					setValue={handleChangeSpinner}
					step={step}
					value={getValue().number || 0}
				/>
			)}
		</div>
	);
};

export default memo(Control);
