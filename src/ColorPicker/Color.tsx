import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import $ from "jquery";
import tinycolor from "tinycolor2";
import More from "wix-ui-icons-common/More";

import OutsideClick from "../OutsideClick";
import Preview from "./Preview";

import { Box, TextButton, Tooltip } from "@wix/design-system";

import { hightlightColors as hightlightColorsSample, presets } from "./colors";
import {
	FIELD_CODE,
	FIELD_GROUP_ID,
	FIELD_ID,
	FIELD_NAME,
	LOCALSTORAGE_KEY,
} from "./constants";
import Form from "./FormInput";
import Modal from "./ModalColor";
import Picker from "./Picker";
import Swatches from "./Swatches";
import TabGroups from "./TabGroups";
import {
	getRecentColors,
	isValidHex,
	isValidRGB,
	isValidRGBA,
	isValueColor,
	RGBToHex,
} from "./utils";

import { classes, st } from "./Color.st.css";

import type {
	ColorPickerColor as ColorType,
	CommonProps,
	ColorPickerGroup,
	ColorPickerValue,
	ValueColors,
} from "./types";

export type ColorPickerProps = CommonProps & {
	onAddColor?: (color?: ColorType) => void;
	setValue?: (value?: ColorPickerValue) => void;
	onDeleteColor?: (color?: ColorType) => void;
};

function Color(props: ColorPickerProps) {
	const groups: ColorPickerGroup[] | undefined = useMemo(
		() =>
			_.isEmpty(props.groups)
				? [
						{
							name: "Preset",
							id: "preset",
							colors: presets,
						},
						{
							name: "Recent",
							id: "recent",
							colors: getRecentColors(props.id),
						},
				  ]
				: props.groups,
		[props.groups, props.id]
	);
	const {
		className,
		containerEl,
		dataHook,
		disabled,
		hightlightColors,
		id,
		isAlpha,
		isShowGroups,
		isShowHighlightColor,
		onAddColor,
		setValue,
		onDeleteColor,
		previewPicker,
		previewProps,
		value,
	} = props;
	const [showPicker, setShowPicker] = useState<boolean | undefined>(
		props.showPicker
	);
	const [showPalette, setShowPalette] = useState<boolean>(false);
	const [activedGroupId, setActivedGroupId] = useState<string>(
		_.head(groups)?.id || ""
	);
	const [isFormExpanded, setFormExpanded] = useState<boolean>(false);
	const [showSwatchActions, setShowSwatchActions] = useState<boolean>(false);
	const [isModalShown, setModalShown] = useState<boolean>(false);
	const [isSelected, setSelected] = useState<boolean>(true);
	const [valueOriginColorHex, setValueOriginColorHex] = useState<ColorType>(
		{} as ColorType
	);
	const typeSaveOrDelete = useRef<"delete" | "save">();
	const valueExactlyColor = useRef<ColorType>({} as ColorType);
	const valueSelected = useRef<boolean>(false);

	const activedGroup = _.find(groups, (group) => group.id === activedGroupId);

	const isColor = useMemo(
		() =>
			isValidHex(_.get(value, FIELD_CODE)) ||
			isValidRGB(_.get(value, FIELD_CODE)) ||
			(isAlpha && isValidRGBA(_.get(value, FIELD_CODE))),
		[isAlpha, value]
	);

	const selectedId = useMemo(() => {
		if (!_.isUndefined(value)) {
			return !_.isUndefined(value[FIELD_ID]) && !_.isEmpty(value[FIELD_ID])
				? _.get(value, FIELD_ID)
				: _.isUndefined(value[FIELD_ID]) || _.isEmpty(value[FIELD_ID])
				? isValidRGB(_.get(value, FIELD_CODE)) ||
				  isValidRGBA(_.get(value, FIELD_CODE))
					? RGBToHex(_.get(value, FIELD_CODE) || "")
					: _.get(value, FIELD_CODE)
				: "";
		}
		return;
	}, [value]);

	const container = !!containerEl && $(containerEl)[0];

	const onChangeValueColor = useCallback(
		(value: ColorType) => {
			if (disabled) {
				return;
			}
			const newValue = { ...value };
			!_.isUndefined(setValue) && setValue(newValue);
		},
		[disabled, setValue]
	);

	const updateValue = useCallback(
		(value: ColorType) => {
			if (disabled) {
				return;
			}
			const newValue = { ...value };
			if (!isFormExpanded) {
				delete newValue[FIELD_GROUP_ID];
				delete newValue[FIELD_ID];
				delete newValue[FIELD_NAME];
			}
			!_.isUndefined(setValue) && setValue(newValue);
		},
		[disabled, isFormExpanded, setValue]
	);

	const saveToRecentColors = useCallback(
		(color: ColorType) => {
			if (disabled) {
				return;
			}
			const recentColors: ColorType[] = getRecentColors(id);
			const indexGruopRecent = _.findIndex(groups, ["id", "recent"]);
			const index = _.findIndex(
				recentColors,
				(_color) => _color[FIELD_CODE] === color[FIELD_CODE]
			);
			if (index === -1) {
				recentColors.unshift({
					...color,
					[FIELD_GROUP_ID]: "",
					[FIELD_ID]: "",
				});
			} else {
				recentColors.splice(index, 1);
				recentColors.unshift({
					...color,
					[FIELD_GROUP_ID]: "",
					[FIELD_ID]: "",
				});
			}
			if (
				!_.isUndefined(groups) &&
				!_.isUndefined(indexGruopRecent) &&
				groups[indexGruopRecent]
			) {
				groups[indexGruopRecent].colors = recentColors;
			}
			localStorage.setItem(
				`${LOCALSTORAGE_KEY}${id ? `-${id}` : ""}`,
				JSON.stringify(_.slice(recentColors, 0, 100))
			);
		},
		[disabled, groups, id]
	);

	useEffect(() => {
		if (disabled) {
			return;
		}
		const recentColors: ColorType[] = getRecentColors(id);
		const indexGruopRecent = _.findIndex(groups, ["id", "recent"]);
		if (
			!_.isUndefined(groups) &&
			!_.isUndefined(indexGruopRecent) &&
			groups[indexGruopRecent]
		) {
			groups[indexGruopRecent].colors = recentColors;
		}
	}, [disabled, groups, id]);

	const handleCancelModal = () => setModalShown(false);

	const handleTogglePicker = () =>
		!disabled && setShowPicker((status) => !status);

	const handlePickerChanged = useCallback(
		(colors?: ValueColors) => {
			if (disabled) {
				return;
			}
			const rgb = colors?.rgb;
			const color = isAlpha
				? {
						...value,
						[FIELD_CODE]:
							!_.isUndefined(rgb) && rgb.a === 1
								? colors?.hex
								: tinycolor(rgb).toRgbString(),
				  }
				: {
						...value,
						[FIELD_CODE]: colors?.hex,
				  };
			if (!color.id) {
				valueSelected.current = true;
			}
			setSelected(false);
			updateValue({ ...color });
		},
		[disabled, isAlpha, updateValue, value]
	);

	const handleSelectColor = useCallback(
		(color?: ColorType) => {
			if (showSwatchActions && color && color[FIELD_ID]) {
				setFormExpanded(true);
			}
			color && onChangeValueColor(color);
			color && saveToRecentColors(color);
			valueSelected.current = false;
		},
		[onChangeValueColor, saveToRecentColors, showSwatchActions]
	);

	const handleDeleteColor = useCallback(
		(color?: ColorPickerValue) => {
			setModalShown(true);
			color && onChangeValueColor(color);
			typeSaveOrDelete.current = "delete";
		},
		[onChangeValueColor]
	);

	const handleToggleColors = () => {
		if (!disabled) {
			valueSelected.current = true;
			setShowPalette((status) => !status);
		}
	};

	const handleClearForm = () =>
		updateValue({
			...value,
			code: "",
		});

	const handleUpdateForm = (values: ColorType) => updateValue(values);

	const handleSubmitForm = (values: ColorType) => {
		!isModalShown && setModalShown(true);
		updateValue(values);
		typeSaveOrDelete.current = "save";
	};

	const handleSaveModal = () => {
		if (!_.isUndefined(groups)) {
			const valueColorDefault = _.find(
				activedGroup?.colors,
				(item) => item[FIELD_CODE] === "#000000"
			);
			const color = isColor ? { ...value } : { ...valueColorDefault };
			if (typeSaveOrDelete.current === "save") {
				updateValue(color);
				onAddColor && onAddColor(color);
			} else if (typeSaveOrDelete.current === "delete") {
				onDeleteColor && onDeleteColor(color);
			}
			saveToRecentColors(color);
		}
		setModalShown(false);
		setFormExpanded(false);
	};

	const findColor = () => {
		setFormExpanded(false);
		const groupGlobal = activedGroup?.editable ? activedGroup : undefined;
		const valueColor =
			value &&
			_.find(groupGlobal?.colors, (item) => item[FIELD_ID] === value[FIELD_ID]);

		if (valueColor) {
			onChangeValueColor(valueColor);
		} else {
			onChangeValueColor({ ...value, name: "" });
		}
	};

	const handleCancelForm = () => findColor();

	const handleToggleSwatchActions = () => {
		setFormExpanded(false);
		setShowSwatchActions((status) => !status);
	};

	const handleActiveTab = (tab: ColorPickerGroup) => {
		valueSelected.current = true;
		setShowSwatchActions(false);
		setActivedGroupId(tab.id);
	};

	const handleExpandForm = () => {
		findColor();
		setShowPicker(true);
		setFormExpanded(true);
	};

	const handleColor = useCallback(
		(value?: ColorType) => value && setValueOriginColorHex(value),
		[]
	);

	const handleChangeSelected = useCallback((isSelected?: boolean) => {
		!_.isUndefined(isSelected) && setSelected(isSelected);
	}, []);

	const renderPreviewPicker = (preview: boolean) => (
		<Picker
			color={
				isColor || isValueColor(_.get(value, FIELD_CODE))
					? _.get(value, FIELD_CODE)
					: _.get(valueExactlyColor.current, FIELD_CODE)
			}
			handleColor={handleColor}
			isAlpha={isAlpha}
			isColor={isValueColor(_.get(value, FIELD_CODE))}
			previewPicker={preview}
			value={value}
			onChange={handlePickerChanged}
		/>
	);

	const renderColorPicker = () => (
		<Box
			className={st(classes.root, { disabled, previewPicker }, className)}
			dataHook={dataHook}
			direction="vertical"
			width={previewPicker ? "100%" : 385}
		>
			{previewPicker ? (
				showPicker ? (
					<OutsideClick onOutsideClick={() => setShowPicker(false)}>
						{renderPreviewPicker(true)}
					</OutsideClick>
				) : (
					<Preview
						previewStyles={
							value && !_.isEmpty(value.code)
								? { backgroundColor: value?.code }
								: {}
						}
						addTitle={"Add Color"}
						className={classes.previewWraper}
						disabled={disabled}
						id={previewProps?.id}
						onClickCanvas={() => setShowPicker(true)}
						onClickDeleteButton={previewProps?.onClickDeleteButton}
						onClickEditButton={previewProps?.onClickEditButton}
						onClickResetButton={previewProps?.onClickResetButton}
					/>
				)
			) : (
				showPicker && renderPreviewPicker(false)
			)}

			<Box display="inline-block" marginTop="3px" width={385}>
				<Box verticalAlign="middle">
					<div className={classes.currentColorWrapper}>
						<Tooltip
							content={
								isColor || isValueColor(_.get(value, FIELD_CODE))
									? _.get(value, FIELD_CODE)
									: _.get(valueExactlyColor.current, FIELD_CODE)
							}
							disabled={
								(!_.get(value, FIELD_CODE) &&
									!_.get(valueExactlyColor.current, FIELD_CODE)) ||
								disabled
							}
							appendTo="window"
						>
							<div
								className={classes.currentColor}
								onClick={handleTogglePicker}
							>
								<div
									style={{
										background:
											isColor || isValueColor(_.get(value, FIELD_CODE))
												? _.get(value, FIELD_CODE)
												: _.get(valueExactlyColor.current, FIELD_CODE),
									}}
									className={classes.currentColorOverlay}
									data-type="div-current-color"
								/>
							</div>
						</Tooltip>
						<TextButton
							className={st(classes.expandBtn, {
								actived: showPalette,
								showPaletteVertival:
									showPalette &&
									(isShowGroups || _.isUndefined(isShowGroups)) &&
									!_.isUndefined(activedGroup) &&
									!_.isEmpty(activedGroup.colors),
							})}
							disabled={disabled}
							size="small"
							skin="dark"
							onClick={handleToggleColors}
						>
							<More height="28px" width="28px" />
						</TextButton>
					</div>
					<Box flex={1} marginLeft="15px">
						{showPalette && activedGroup ? (
							<Form
								group={activedGroup}
								handleChangeSelected={handleChangeSelected}
								isColor={isColor}
								isExpanded={isFormExpanded && !!activedGroup?.editable}
								isValueColor={isValueColor(_.get(value, FIELD_CODE))}
								openExpandForm={handleExpandForm}
								valueOriginColorHex={valueOriginColorHex}
								values={value}
								onCancel={handleCancelForm}
								onClear={handleClearForm}
								onSubmit={handleSubmitForm}
								onUpdate={handleUpdateForm}
							/>
						) : isShowHighlightColor || _.isUndefined(isShowHighlightColor) ? (
							<Swatches
								colors={
									hightlightColors && _.size(hightlightColors)
										? hightlightColors
										: hightlightColorsSample
								}
								disabled={disabled}
								handleChangeSelected={handleChangeSelected}
								selectedId={valueSelected.current ? "" : selectedId}
								onSelect={handleSelectColor}
							/>
						) : null}
					</Box>
				</Box>
				<Box>
					{isShowGroups || _.isUndefined(isShowGroups) ? (
						<div className={classes.swatchesWrapper}>
							<TabGroups
								activedGroupId={activedGroupId}
								disabled={disabled}
								groups={groups}
								handleActiveTab={handleActiveTab}
								handleToggleSwatchActions={handleToggleSwatchActions}
								showPalette={showPalette}
								showSwatchActions={showSwatchActions}
							/>
							{showPalette && activedGroup && (
								<Swatches
									colors={activedGroup.colors}
									disabled={disabled}
									handleChangeSelected={handleChangeSelected}
									selectedId={valueSelected.current ? "" : selectedId}
									showActions={showSwatchActions}
									onDelete={handleDeleteColor}
									onSelect={handleSelectColor}
								/>
							)}
						</div>
					) : null}
				</Box>
			</Box>

			<Modal
				content={activedGroup?.modal?.content}
				primaryButtonText={activedGroup?.modal?.primaryButtonText}
				secondaryButtonText={activedGroup?.modal?.secondaryButtonText}
				shown={isModalShown}
				title={activedGroup?.modal?.title}
				onAccept={handleSaveModal}
				onCancel={handleCancelModal}
				onClose={handleCancelModal}
			/>
		</Box>
	);

	useEffect(() => {
		if (container && showPicker) {
			$(container).parent().addClass("has-color-picker");
			$(container).on("ABC", () => {
				alert("ABC");
			});
		}

		return () => {
			if (container) {
				$(container).parent().removeClass("has-color-picker");
			}
		};
	}, [container, showPicker]);

	return container
		? ReactDOM.createPortal(renderColorPicker(), container)
		: renderColorPicker();
}

export default memo(Color);
