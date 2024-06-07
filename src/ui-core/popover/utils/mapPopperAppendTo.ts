import type { PopoverProps } from "../types";

export const mapPopperAppendTo = (appendTo: PopoverProps["appendTo"]) => {
	if (typeof appendTo === "function" || appendTo === "parent") {
		return;
	}
	return appendTo;
};
