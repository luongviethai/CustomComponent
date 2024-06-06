import _ from "lodash";

import { manyColor, presets } from "./colors";
import { LOCALSTORAGE_KEY } from "./constants";

import type { ColorPickerValue, ColorPickerGroup } from "./types";

export const isValidHex = (colorCode: ColorPickerValue["code"]): boolean => {
	if (!colorCode || typeof colorCode !== "string") {
		return false;
	}

	let newColorCode = colorCode;
	if (newColorCode.substring(0, 1) === "#") {
		newColorCode = newColorCode.substring(1);
	}

	switch (newColorCode.length) {
		case 3:
			return /^[0-9A-F]{3}$/i.test(newColorCode);
		case 6:
			return /^[0-9A-F]{6}$/i.test(newColorCode);
		case 8:
			return /^[0-9A-F]{8}$/i.test(newColorCode);
		default:
			return false;
	}
};

export const isValidRGBA = (colorCode: ColorPickerValue["code"]): boolean => {
	if (!colorCode || typeof colorCode !== "string") {
		return false;
	}
	const rgbRegex =
		/^rgba[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*,){3}\s*0*(?:\.\d+|1(?:\.0*)?)\s*[)]$/gm;
	if (rgbRegex.test(colorCode)) {
		return true;
	}

	return false;
};

export const isValidRGB = (colorCode: ColorPickerValue["code"]): boolean => {
	if (!colorCode || typeof colorCode !== "string") {
		return false;
	}
	const rgbRegex =
		/^rgb[(](?:\s*0*(?:\d\d?(?:\.\d+)?(?:\s*%)?|\.\d+\s*%|100(?:\.0*)?\s*%|(?:1\d\d|2[0-4]\d|25[0-5])(?:\.\d+)?)\s*(?:,(?![)])|(?=[)]))){3}[)]$/gm;
	if (rgbRegex.test(colorCode)) {
		return true;
	}

	return false;
};

export function isValueColor(strColor?: string) {
	if (strColor) {
		const s = new Option().style;
		s.color = strColor;
		if (s.color === strColor) {
			return true;
		}
	}
	return false;
}

export const getRecentColors = (id?: string) => {
	try {
		return JSON.parse(
			localStorage.getItem(`${LOCALSTORAGE_KEY}${id ? `-${id}` : ""}`) || "[]"
		);
	} catch (e) {
		return [];
	}
};

export function RGBToHex(rgb: string) {
	// Choose correct separator
	const sep = rgb.indexOf(",") > -1 ? "," : " ";
	// Turn "rgb(r,g,b)" into [r,g,b]
	const rgbaSplit = rgb
		.substring(rgb.indexOf("(") + 1)
		.split(")")[0]
		.split(sep);

	let r = (+rgbaSplit[0]).toString(16);
	let g = (+rgbaSplit[1]).toString(16);
	let b = (+rgbaSplit[2]).toString(16);
	let a = "";

	if (_.includes(rgb, "rgba") && rgbaSplit[3] !== "1") {
		a = Math.round(+rgbaSplit[3] * 255).toString(16);
		if (a.length === 1) {
			a = `0${a}`;
		}
	}

	if (r.length === 1) {
		r = `0${r}`;
	}
	if (g.length === 1) {
		g = `0${g}`;
	}
	if (b.length === 1) {
		b = `0${b}`;
	}

	return `#${r}${g}${b}${a}`;
}

export function prepareColors(isManyColor?: boolean): ColorPickerGroup[] {
	const globalColors: ColorType[] = [];
	_.each(_.shuffle(isManyColor ? manyColor : presets), (color) => {
		globalColors.push({ ...color, id: _.uniqueId(), groupId: "global" });
	});

	const recentColors: ColorType[] = [];
	_.each(_.shuffle(presets), (color) => {
		recentColors.push(color);
	});

	return [
		{
			name: "Preset",
			id: "preset",
			colors: presets,
		},
		{
			name: "Global",
			id: "global",
			editable: true,
			colors: globalColors,
			modal: {
				title: "Are you sure?",
				content:
					"You've made changes to this global color. This will affect all instances of this global color across your entire site. Do you wish to proceed?",
				primaryButtonText: "Save",
				secondaryButtonText: "Cancel",
			},
		},
		{
			name: "Recent",
			id: "recent",
			colors: [],
		},
	];
}
