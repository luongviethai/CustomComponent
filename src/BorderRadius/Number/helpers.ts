import _ from "lodash";

export type CSSUnit = {
	number: number | null;
	text: string;
	unit: string;
};

/**
 * Convert value to return number
 *
 * @param {String|Number} value
 * @param {String|Number} defaultValue
 */

export function getNumber(
	value: number | string,
	defaultValue?: number | string
): number | null {
	const convertedValue = _.toString(value);

	// eslint-disable-next-line no-nested-ternary
	return !_.isEmpty(convertedValue) && !_.isNaN(parseFloat(convertedValue))
		? parseFloat(convertedValue)
		: !_.isUndefined(defaultValue)
		? getNumber(defaultValue)
		: null;
}

export function getCssUnit<V>(config: {
	allowedUnits?: string[];
	allowedValues?: string[];
	defaultUnit?: string;
	defaultValue?: V;
	value: V;
}): CSSUnit | undefined {
	const { allowedValues, defaultValue } = config;
	const allowedUnits = [
		...(config.defaultUnit ? [config.defaultUnit] : []),
		...(config.allowedUnits || []),
	];
	const defaultUnit = _.head(allowedUnits) || "";
	const formattedValue = _.toString(config.value);
	const number = getNumber(formattedValue);

	/**
	 * If value type is number
	 */
	if (_.isNumber(config.value) && !_.isNaN(config.value)) {
		return {
			number,
			text: _.toString(number + defaultUnit),
			unit: defaultUnit,
		};
	}

	/**
	 * If value includes allowed_value
	 */
	if (_.includes(allowedValues, config.value)) {
		return {
			number,
			text: formattedValue,
			unit: "",
		};
	}

	/**
	 * If value has at least 1 number and not empty
	 */
	if (!_.isNull(number)) {
		const reg = new RegExp(`(${_.join(allowedUnits, "|")})`, "g");
		const units = formattedValue.match(reg);
		const unit = units ? units.reverse()[0] : defaultUnit;
		return {
			number,
			text: _.toString(number + unit),
			unit,
		};
	}

	if (!_.isEmpty(defaultValue) && !_.isNil(defaultValue))
		return getCssUnit({ ...config, value: defaultValue });
}
