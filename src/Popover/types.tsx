import type { PopoverProps as PopoverPropsCore } from "../ui-core/popover";

export type PopoverProps = Omit<PopoverPropsCore, "shown"> & {
	dataHook?: string;
	animate?: boolean;
	theme?: PopoverTheme;
	disableClickOutsideWhenClosed?: boolean;
	shown?: boolean;
};

export type PopoverTheme = "dark" | "light";
