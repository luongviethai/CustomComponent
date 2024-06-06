import type { FontFamilyVendorFont, FontFamilyGroupType } from "./types";

function createLink(url: string) {
	const link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	return link;
}

function insertLinkToHead(url?: string) {
	if (url && !document.querySelector(`link[href="${url}"]`)) {
		const link = createLink(url);
		const head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
		return link;
	}
	return;
}

export function insertFontToHead(
	type: FontFamilyGroupType,
	font: FontFamilyVendorFont,
	family: string
) {
	let url: string | undefined;

	switch (type) {
		case "google": {
			url = `https://fonts.googleapis.com/css?family=${family.replace(
				/ /g,
				"+"
			)}:${font.variants}&display=swap`;
			break;
		}

		case "local":
			url = font.files?.["400"];
			break;
	}
	insertLinkToHead(url);
}
