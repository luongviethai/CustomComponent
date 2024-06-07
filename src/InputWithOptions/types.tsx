import * as React from "react";
// import { OmitPolyfill, PopoverCommonProps } from "../common";
import type {
	DropdownLayoutValueOption,
	DropdownLayoutProps,
} from "../DropdownLayout";
import type { InputProps } from "../Input";

export interface InputWithOptionsProps<
	ManualInputFn = ManualInputFnSignature,
	OnSelectFn = OnSelectFnSignature
> extends InputProps,
		OmitPolyfill<DropdownLayoutProps, "onSelect"> {
	autocomplete?: string;

	/** Use a customized input component instead of the default wix-style-react `<Input/>` component */
	inputElement?: React.ReactElement;

	/** Closes DropdownLayout on option selection */
	closeOnSelect?: boolean;

	/** A callback which is called when the user performs a Submit-Action.
	 * Submit-Action triggers are: "Enter", "Tab", [typing any defined delimiters], Paste action.
	 * `onManuallyInput(values: Array<string>): void - The array of strings is the result of splitting the input value by the given delimiters */
	onManuallyInput?: ManualInputFn;

	/** Function that receives an option, and should return the value to be displayed. */
	valueParser?: (
		option: DropdownLayoutValueOption
	) => DropdownLayoutValueOption["value"];

	/** Sets the width of the dropdown */
	dropdownWidth?: string;

	/** Sets the offset of the dropdown from the left */
	dropdownOffsetLeft?: string;

	/** Controls whether to show options if input is empty */
	showOptionsIfEmptyInput?: boolean;

	/** Mark in bold word parts based on search pattern */
	highlight?: boolean;

	/** Indicates whether to render using the native select element */
	native?: boolean;

	/** common popover props */
	popoverProps?: PopoverCommonProps;

	onSelect?: OnSelectFn;

	onOptionsShow?: () => void;

	onOptionsHide?: () => void;

	virtualization?: boolean;
}

export type ManualInputFnSignature = (
	inputValue: string,
	suggestedOption: DropdownLayoutValueOption
) => void;

export type OnSelectFnSignature = DropdownLayoutProps["onSelect"];

export interface InputWithOptionsState {
	inputValue: string;
	showOptions: boolean;
	lastOptionsShow: number;
	isEditing: boolean;
	isComposing: boolean;
}
