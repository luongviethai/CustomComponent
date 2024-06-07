import { useCallback } from "react";
import _ from "lodash";
import Dropdown, { type DropdownProps } from "../Dropdown";
import type {
	FontFamilyFontVendors,
	FontFamilyGroupType,
	FontFamilyValue,
} from "../FontFamily";
import { FONT_VARIANTS } from "./constants";
import type { DropdownLayoutValueOption } from "../DropdownLayout";
import { convertOptions } from "./helpers";

export type FontWeightProps = {
	disabled?: boolean;
	fontVendors?: FontFamilyFontVendors;
	parentId?: string;
	parentName?: string;
	value?: FontFamilyValue;
	readOnly?: boolean;
	required?: boolean;
	selectedFamily: string;
	selectedType: FontFamilyGroupType;
	setValue?: (value: FontFamilyValue) => void;
	onBlur?: DropdownProps["onBlur"];
	placeholder?: DropdownProps["placeholder"];
};

function FontWeight(props: FontWeightProps) {
	const {
		disabled,
		fontVendors,
		selectedType,
		selectedFamily,
		value,
		setValue,
		onBlur,
		placeholder,
	} = props;

	const getOptions = useCallback(() => {
		const selectedFont = fontVendors?.[selectedType]?.fonts?.[selectedFamily];
		let options: any[] = [];
		if (selectedFont) {
			_.each(selectedFont.variants, (variant) => {
				if (_.has(FONT_VARIANTS, variant)) {
					options.push({
						label: FONT_VARIANTS[variant],
						value: _.toString(variant),
					});
				}
			});
		} else {
			options = [
				{
					label: "Light",
					value: "300",
				},
				{
					label: "Regular",
					value: "400",
				},
				{
					label: "Semi Bold",
					value: "600",
				},
				{
					label: "Bold",
					value: "700",
				},
				{
					label: "Ultra Bold",
					value: "800",
				},
			];
		}

		return convertOptions(options);
	}, [fontVendors, selectedFamily, selectedType]);

	const handleChangeValue = (weight?: number | string) =>
		_.isString(weight) &&
		_.isFunction(setValue) &&
		!_.isUndefined(value) &&
		setValue({
			...value,
			weight,
		});

	const handleOnSelect = (option: DropdownLayoutValueOption) => {
		handleChangeValue(option.id);
	};

	return (
		<Dropdown
			popoverProps={{
				appendTo: "window",
			}}
			placeholder={placeholder}
			disabled={disabled}
			options={getOptions()}
			selectedId={value?.weight || "400"}
			onSelect={handleOnSelect}
			onBlur={onBlur}
		/>
	);
}

export default FontWeight;
