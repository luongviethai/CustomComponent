import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import _ from "lodash";
import $ from "jquery";
import { ConfirmSmall } from "@wix/wix-ui-icons-common";

import { DropdownLayoutOption, Text, Box } from "@wix/design-system";
import { listItemSectionBuilder } from "../ListItemSection";
import ListItemSelect, {
	listItemSelectBuilder,
	type ListItemSelectProps,
} from "../ListItemSelect";
import Dropdown from "../Dropdown";
import { insertFontToHead } from "./helpers";
import { SEPARATOR } from "./constants";
import SingleFont from "./SingleFont";
import { st, classes } from "./FontFamily.st.css";
import type {
	FontFamilyFontVendor,
	FontFamilyFontVendors,
	FontFamilyGroupType,
	FontFamilyVendorFont,
} from "./types";

export type PropsFontFamily = {
	onChangeValue?: (value: string) => void;
	value?: string;
	selectedType?: FontFamilyGroupType;
	selectedWeight?: string;
	fontVendors?: FontFamilyFontVendors;
	className?: string;
	disabled?: OptionsProps["disabled"];
	readOnly?: OptionsProps["disabled"];
	id?: string;
	dataHook?: string;
};

export type OptionsProps = {
	id: string | number;
	disabled: boolean | undefined;
	overrideOptionStyle: true;
	label?: string | undefined;
	value: (
		props: Partial<ListItemSelectProps & { hovered: boolean }>
	) => React.ReactNode;
};

function FontFamily(props: PropsFontFamily) {
	const {
		onChangeValue,
		selectedType,
		selectedWeight,
		value,
		fontVendors,
		className,
		disabled,
		readOnly,
		id,
	} = props;

	const fontSingle = useMemo(
		() =>
			selectedType && value && fontVendors
				? fontVendors?.[selectedType]?.fonts?.[value]
				: ({} as FontFamilyVendorFont),
		[fontVendors, selectedType, value]
	);
	const [optionsReCent, setOptionsReCent] = useState<OptionsProps[]>(
		value
			? [
					listItemSelectBuilder({
						id: `${selectedType}${SEPARATOR}${value}`,
						title: (
							<SingleFont
								font={fontSingle}
								type={selectedType}
								fontFamily={value}
							/>
						),
						label: value,
					}),
			  ]
			: []
	);
	const [selectedIdReCent, setSelectedIdReCent] = useState<string | undefined>(
		value ? `${selectedType}${SEPARATOR}${value}` : ""
	);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const renderFontGroup = useCallback((vendor: FontFamilyFontVendor) => {
		let newVendors: OptionsProps[] = [];
		const nodeOption = listItemSectionBuilder({
			title: vendor.name,
			id: "",
		}) as OptionsProps;

		if (nodeOption) {
			newVendors = [
				nodeOption,
				..._.map(vendor.fonts, (font, id: string) =>
					listItemSelectBuilder({
						id: `${vendor.id}${SEPARATOR}${id}`,
						title: <SingleFont font={font} type={vendor.id} fontFamily={id} />,
						label: id,
					})
				),
			];
		}

		return newVendors;
	}, []);

	const getOptions = useMemo(() => {
		let options: DropdownLayoutOption[] = [];

		if (!_.isEmpty(fontVendors)) {
			_.each(fontVendors, (vendor) => {
				const fontGroup = renderFontGroup(vendor) as DropdownLayoutOption[];
				options = _.concat(options, fontGroup);
			});
		} else {
			if (value && selectedType)
				options.push({
					id: `${selectedType}${SEPARATOR}${value}`,
					value: value,
				});
		}
		options.unshift({
			value: "Default",
			id: "",
		});

		return options;
	}, [fontVendors, renderFontGroup, selectedType, value]);

	const handleOnSelect = (option: OptionsProps) => {
		setSelectedIdReCent(_.toString(option?.id));

		const typeFont = _.split(
			_.toString(option?.id),
			SEPARATOR
		)[0] as FontFamilyGroupType;
		const newOptions = _.cloneDeep(optionsReCent);

		if (option?.id !== "") {
			if (_.size(newOptions) < 5 && !_.find(newOptions, ["id", option?.id])) {
				newOptions.unshift(
					listItemSelectBuilder({
						id: _.toString(option?.id),
						title: (
							<SingleFont
								font={fontSingle}
								type={typeFont}
								fontFamily={option?.label}
							/>
						),
						label: option?.label || _.toString(option?.value),
					})
				);
			} else {
				newOptions.splice(_.findIndex(optionsReCent, ["id", option?.id]), 1);
				newOptions.unshift(
					listItemSelectBuilder({
						id: _.toString(option?.id),
						title: (
							<SingleFont
								font={fontSingle}
								type={typeFont}
								fontFamily={option?.label}
							/>
						),
						label: option?.label || _.toString(option?.value),
					})
				);
			}
		}

		_.slice(newOptions, 0, 5);
		setOptionsReCent(newOptions);
		_.isString(option?.id) &&
			!_.isUndefined(onChangeValue) &&
			onChangeValue(option?.id);
	};

	useEffect(() => {
		if (selectedType && fontSingle)
			!_.isUndefined(value) &&
				insertFontToHead(selectedType, fontSingle, value);
	}, [fontSingle, selectedType, value]);

	useEffect(() => {
		if (wrapperRef?.current && (selectedWeight || value) && fontSingle)
			$(wrapperRef.current)
				.find(".admin-input-value")
				.css({
					fontFamily: value || "",
					fontWeight: _.toNumber(selectedWeight) || 400,
				});
	}, [selectedWeight, value, fontSingle]);

	const contentSelectedReCent = () => {
		return (
			<div className={classes.recent}>
				<Text className={classes.TexRecent}>{"ReCent"}</Text>
				{_.map(optionsReCent, (item) => (
					<ListItemSelect
						className={classes.listItemSelect}
						key={item.id}
						selected={selectedIdReCent === item.id ? true : false}
						title={
							<span
								className={classes.root}
								style={{ fontFamily: item.label }}
								data-hook="content-font-recent"
							>
								{item.label}
							</span>
						}
						suffix={
							selectedIdReCent === item.id && (
								<Box>
									<ConfirmSmall />
								</Box>
							)
						}
						onClick={() => {
							handleOnSelect(item);
							if (id) $(`#${id} [data-hook="input-menu-arrow"]`)[0].click();
							else $(`[data-hook="input-menu-arrow"]`)[0].click();
						}}
					/>
				))}
			</div>
		);
	};

	return (
		<div className={st(classes.root, className)} ref={wrapperRef} id={id}>
			<Dropdown
				className="admin-input-value"
				placeholder="Select Font Family"
				options={getOptions}
				onSelect={handleOnSelect}
				focusOnSelectedOption={!!value}
				selectedId={value ? `${selectedType}${SEPARATOR}${value}` : ""}
				emptyStateMessage="Can't find: "
				fixedHeader={<div>{contentSelectedReCent()}</div>}
				searchable
				maxHeight={250}
				maxHeightPixels={580}
				searchDebounce={500}
				virtualization
				disabled={disabled}
				readOnly={readOnly}
			/>
		</div>
	);
}

export default memo(FontFamily);
