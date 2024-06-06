import { memo } from "react";
import _ from "lodash";
import tinycolor from "tinycolor2";
import Delete from "wix-ui-icons-common/Delete";
import Edit from "wix-ui-icons-common/Edit";
import { Box, Tooltip } from "@wix/design-system";
import type { ColorPickerValue } from "../types";
import { st, classes } from "./Swatch.st.css";

type SwatchProps = {
	color?: ColorPickerValue;
	isSelected?: boolean;
	onDelete?: (color?: ColorPickerValue) => void;
	onSelect?: (color?: ColorPickerValue) => void;
	handleChangeSelected?: (isSelected?: boolean) => void;
	showActions?: boolean;
	disabled?: boolean;
};

function Swatch(props: SwatchProps) {
	const {
		color,
		isSelected,
		onSelect,
		onDelete,
		showActions,
		handleChangeSelected,
		disabled,
	} = props;

	const code = tinycolor(color?.code) ? color?.code : "";

	const handleDelete = () => {
		_.isFunction(onDelete) && onDelete(color);
	};

	return (
		<div
			className={st(classes.root, { disabled })}
			onMouseMove={() =>
				!_.isUndefined(handleChangeSelected) && handleChangeSelected(true)
			}
		>
			<Box className={classes.swatchInner} align="center" position="relative">
				<div
					className={st(classes.swatch, {
						selected: isSelected,
						isTransparent: color?.code === "transparent",
					})}
					style={{ backgroundColor: code }}	
					onClick={() => _.isFunction(onSelect) && onSelect(color)}
				>
					<Tooltip
						appendTo="window"
						className={classes.swatchTooltip}
						content={color?.name || code}
						disabled={disabled}
					>
						<div className={classes.swatchLabel}>{code}</div>
					</Tooltip>
				</div>
				{showActions && (
					<Edit
						className={classes.swatchEditBtn}
						width="16px"
						height="16px"
					/>
				)}
			</Box>
			{showActions && (
				<Delete
					className={classes.swatchDeleteBtn}
					onClick={handleDelete}
					width="24px"
					height="24px"
				/>
			)}
		</div>
	);
}

export default memo(Swatch);
