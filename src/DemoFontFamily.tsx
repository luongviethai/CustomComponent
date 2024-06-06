import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";
import type {
	FontFamilyFontVendors,
	FontFamilyGroupType,
	FontFamilyValue,
} from "./FontFamily/types";
import {
	FIELD_VENDER_GOOGLE,
	FIELD_VENDER_LOCAL,
	SEPARATOR,
} from "./FontFamily/constants";
import FontFamily from "./FontFamily";

export default function DemoFontFamily() {
	const [fontVendors, setFontVendors] = useState<FontFamilyFontVendors>();
	const [valueFont, setValueFont] = useState<FontFamilyValue>({
		type: "google",
		family: "Coiny",
		weight: "400",
	});
	const selectedType = valueFont?.type || "google";
	const selectedFamily = valueFont?.family || "";
	const selectedWeight = valueFont?.weight || "400";

	const handleChangeValueFont = (value?: FontFamilyValue) => {
		value && setValueFont(value);
	};

	const getFontVendors = useCallback(async () => {
		const vendors = {} as FontFamilyFontVendors;
		const result = await axios.get<{ items: any }>(
			`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyD8Nh_TiZu4m9C9kxeNGBLZ6pgpEp9r0w0`
		);

		const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
		const fonts = {};

		_.each(result.data.items, (font) => {
			const family = font["family"];
			fonts[family] = {
				family: family,
			};
			const files = font["files"];

			const variants: string[] = [];

			_.each(font["variants"], (_variant) => {
				const variant =
					_variant === "regular"
						? 400
						: _variant === "italic"
						? "400italic"
						: _variant;
				if (_.includes(FONT_WEIGHTS, _.toNumber(variant))) {
					variants.push(_.toString(variant));
				} else {
					delete files[variant];
				}
			});

			if (!files["regular"]) return true;

			files["400"] = files["regular"];
			delete files["regular"];

			fonts[family]["variants"] = variants;
			fonts[family]["files"] = files;
		});

		vendors[FIELD_VENDER_GOOGLE] = {
			id: FIELD_VENDER_GOOGLE,
			name: "Google Fonts",
			fonts: fonts,
		};

		vendors[FIELD_VENDER_LOCAL] = {
			id: FIELD_VENDER_LOCAL,
			name: "local Fonts",
			fonts: {
				ABeeZee: {
					family: "ABeeZee",
					files: {
						400: "http://fonts.gstatic.com/s/abeezee/v22/esDR31xSG-6AGleN6tKukbcHCpE.ttf",
					},
					variants: ["400"],
				},
				Abel: {
					family: "Abel",
					files: {
						400: "http://fonts.gstatic.com/s/abeezee/v22/esDR31xSG-6AGleN6tKukbcHCpE.ttf",
					},
					variants: ["400"],
				},
			},
		};

		setFontVendors(vendors);
	}, []);

	useEffect(() => {
		getFontVendors();
	}, [getFontVendors]);

	const handleChangeFontFamily = useCallback(
		(family?: string) => {
			const metadata = _.split(family, SEPARATOR);
			const selectedType = metadata[0] as FontFamilyGroupType;
			const selectedFamily = metadata[1];
			const newValue: FontFamilyValue = {
				type: selectedType,
				family: selectedFamily,
			};

			if (
				selectedType !== valueFont?.type ||
				selectedFamily !== valueFont?.family
			) {
				newValue.weight = "400";
			}
			handleChangeValueFont(newValue);
		},
		[valueFont?.family, valueFont?.type]
	);

	return (
		<FontFamily
			onChangeValue={handleChangeFontFamily}
			value={selectedFamily}
			selectedType={selectedType}
			selectedWeight={selectedWeight}
			fontVendors={fontVendors}
			id={"demo"}
		/>
	);
}
