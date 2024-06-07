import type { DropdownLayoutProps } from "../DropdownLayout";
import type { InputWithOptionsProps } from "../InputWithOptions";

export interface DropdownCommonProps extends InputWithOptionsProps {
	noBorder?: boolean;
	searchUrl?: string;
	searchPlaceholder?: string;
	searchAutoFocus?: boolean;
	searchParams?: {};
	searchDebounceDefault?: number;
	defaultEmptyStateMessage?: string;
	loadMore?: () => void;
	onSelect?: (options: any) => void;
}

export interface DropdownPropsControlled extends DropdownCommonProps {
	selectedId?: DropdownLayoutProps["selectedId"];
	// initialSelectedId?: never;
}

export interface DropdownPropsUncontrolled extends DropdownCommonProps {
	selectedId?: never;
	initialSelectedId?: DropdownLayoutProps["selectedId"];
}

export type DropdownProps = DropdownPropsControlled | DropdownPropsUncontrolled;
