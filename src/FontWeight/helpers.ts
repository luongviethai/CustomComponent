import _ from "lodash";

export const convertOptions = (options) =>
	_.map(options, (option) => {
		if (option.opt) {
			return {
				title: option.label,
				opt: convertOptions(option.opt),
			};
		}
		return {
			id: option.value,
			value: option.label,
		};
	});
