import { DIVIDER_OPTION_VALUE } from "./DropdownLayout";
import type { DropdownLayoutOption, DropdownLayoutValueOption } from "./types";

export const isSelectableOption = (
	option?: DropdownLayoutOption
): option is DropdownLayoutValueOption =>
	!!option &&
	option.value !== DIVIDER_OPTION_VALUE &&
	!(option as DropdownLayoutValueOption).disabled &&
	!(option as DropdownLayoutValueOption).title;
