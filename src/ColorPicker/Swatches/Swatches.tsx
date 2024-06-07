import { memo, useMemo } from "react";
import _ from "lodash";
import { Layout } from "@wix/design-system";
import Swatch from "../Swatch";
import type { ColorPickerValue, ColorPickerColor } from "../types";
import { FIELD_CODE, FIELD_ID } from "../constants";
import { st, classes } from "./Swatches.st.css";

type SwatchesProps = {
	colors?: ColorPickerColor[];
	onDelete?: (color?: ColorPickerValue) => void;
	onSelect?: (color?: ColorPickerValue) => void;
	selectedId?: string;
	dataHook?: string;
	showActions?: boolean;
	disabled?: boolean;
};

function Swatches(props: SwatchesProps) {
	const {
		colors,
		onDelete,
		onSelect,
		selectedId,
		showActions,
		dataHook,
		disabled,
	} = props;

	const renderColors = useMemo(
		() =>
			_.map(colors, (color, index) => (
				<Swatch
					key={index}
					isSelected={
						!_.isUndefined(color[FIELD_ID]) &&
						!_.isEmpty(color[FIELD_ID]) &&
						_.toLower(selectedId) === _.toLower(color[FIELD_ID])
							? true
							: (_.isUndefined(color[FIELD_ID]) ||
									_.isEmpty(color[FIELD_ID])) &&
							  _.toLower(selectedId) === _.toLower(color[FIELD_CODE])
							? true
							: false
					}
					color={color}
					onDelete={onDelete}
					onSelect={onSelect}
					showActions={showActions}
					disabled={disabled}
				/>
			)),
		[colors, disabled, onDelete, onSelect, selectedId, showActions]
	);

	return (
		<Layout
			gap="8px"
			cols={10}
			className={st(classes.root)}
			dataHook={dataHook}
		>
			{renderColors}
		</Layout>
	);
}

export default memo(Swatches);
