import { memo, useEffect } from "react";
import { insertFontToHead } from "../helpers";
import type { FontFamilyVendorFont, FontFamilyGroupType } from "../types";
import { classes } from "./SingleFont.st.css";

type Props = {
	font?: FontFamilyVendorFont;
	type?: FontFamilyGroupType;
	fontFamily?: string;
};

function SingleFont(props: Props) {
	const { font, fontFamily, type } = props;

	useEffect(() => {
		type && font && fontFamily && insertFontToHead(type, font, fontFamily);
	}, [font, fontFamily, type]);

	return (
		<span
			className={classes.root}
			style={{ fontFamily }}
			data-hook="content-font"
		>
			{fontFamily}
		</span>
	);
}

export default memo(SingleFont);
