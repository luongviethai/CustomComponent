import { memo, useEffect, MouseEvent } from "react";
import _ from "lodash";
import $ from "jquery";
import reactCSS from "reactcss";
import { CustomPicker } from "react-color";
import { Saturation, Hue, Alpha } from "react-color/lib/components/common";
import SliderPointer from "../SliderPointer";
import type { ColorPickerValue, ValueColors } from "../types";
import { FIELD_CODE } from "../constants";
import { st, classes } from "./Picker.st.css";

type PickerProps = {
	rgb?: { r: number; g: number; b: number; a: number };
	hsl?: { h: number; s: number; l: number; a: number };
	hsv?: { h: number; s: number; v: number; a: number };
	hex?: string;
	renderers?: string | number;
	onChange?: (
		color?: ValueColors["hsl"] | ValueColors["hex"] | ColorPickerValue,
		type?: "move-y" | "move-all"
	) => void;
	isAlpha?: boolean;
	value?: ColorPickerValue;
	handleColor?: (color?: ColorPickerValue) => void;
	isColor?: boolean;
	disabled?: boolean;
	previewPicker?: boolean;
};

function Picker(props: PickerProps) {
	const {
		rgb,
		hsl,
		hsv,
		renderers,
		onChange,
		isAlpha,
		handleColor,
		value,
		isColor,
		disabled,
		previewPicker,
	} = props;

	useEffect(() => {
		isColor &&
			handleColor &&
			handleColor({ ...value, [FIELD_CODE]: props.hex });
	}, [handleColor, isColor, props.hex, value]);

	const styles = reactCSS(
		_.merge({
			default: {
				saturation: {
					width: "100%",
					height: "200px",
					position: "relative",
					display: "flex",
					gap: "5px",
					maxWidth: previewPicker ? "100%" : "385px",
				},
				Saturation: {
					color: {
						position: "relative",
						flex: "1",
					},
					circle: {
						width: "24px",
						height: "24px",
						cursor: disabled ? "default" : "move",
						boxShadow: "none",
						border: "2px solid #f9f9f9",
						transform: "translate(-50%, -50%)",
					},
					pointer: {
						cursor: disabled ? "default" : "move",
					},
				},
				Alpha: {
					container: {
						margin: "0px 0px",
					},
					gradient: {
						background:
							!_.isUndefined(rgb) &&
							`linear-gradient(to top, rgba(${rgb?.r},${rgb?.g},${rgb?.b}, 0) 0%,
           rgba(${rgb?.r},${rgb?.g},${rgb?.b}, 1) 100%)`,
					},
					pointer: {
						left: 0,
						top:
							!_.isUndefined(rgb) &&
							!_.isUndefined(rgb?.a) &&
							`${(1 - rgb?.a) * 100}%`,
						width: "24px",
						height: "24px",
						marginTop: "-1px",
					},
				},
			},
		})
	);

	const handleChangeAlpha = (
		color?: { a: number; h: number; l: number; s: number; source: string },
		type?: "move-y"
	) => {
		if (!disabled) {
			_.isFunction(onChange) &&
				!_.isUndefined(color) &&
				!_.isUndefined(color?.a) &&
				isAlpha &&
				onChange({
					...color,
					a: isAlpha ? 1 - color?.a : 1,
				});
			$("html").addClass(`end-move-picker ${type}`);
		}
	};

	useEffect(() => {
		const mouseup = () => {
			$("html").removeClass("end-move-picker move-all move-y");
		};
		if ($("html").hasClass("end-move-picker"))
			document.addEventListener("mouseup", mouseup);
	});

	return (
		<div style={styles.saturation} className={st(classes.root, { disabled })}>
			<Saturation
				style={styles.Saturation}
				hsl={hsl}
				hsv={hsv}
				onChange={(
					color?:
						| string
						| Color
						| { h: number; s: number; l: number; a: number },
					e?: MouseEvent
				) => {
					if (!disabled) {
						if (e?.type === "mousedown")
							$("html").addClass(`end-move-picker move-all`);
						_.isFunction(onChange) && onChange(color);
					}
				}}
			/>

			<div className={st(classes.picker, classes.huePickerWrapper)}>
				<Hue
					hsl={hsl}
					pointer={SliderPointer}
					onChange={(
						color?:
							| string
							| { h: number; s: number; l: number; a: number }
							| Color,
						e?: MouseEvent
					) => {
						if (!disabled) {
							if (e?.type === "mousedown")
								$("html").addClass(`end-move-picker move-y`);
							_.isFunction(onChange) && onChange(color);
						}
					}}
					direction="vertical"
				/>
			</div>
			{isAlpha && (
				<div className={st(classes.picker, classes.alphaPickerWrapper)}>
					<Alpha
						style={styles.Alpha}
						rgb={rgb}
						hsl={hsl}
						renderers={renderers}
						onChange={(
							color:
								| { a: number; h: number; l: number; s: number; source: string }
								| undefined
						) => handleChangeAlpha(color, "move-y")}
						pointer={SliderPointer}
						direction="vertical"
					/>
				</div>
			)}
		</div>
	);
}

export default memo(CustomPicker(Picker));
