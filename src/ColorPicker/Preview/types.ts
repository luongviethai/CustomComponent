import type { StatusIndicatorProps } from "@wix/design-system";

export type PreviewProps = React.HTMLAttributes<HTMLDivElement> & {
	addTitle?: string;
	children?: React.ReactNode | React.ReactNode[];
	className?: string;
	dataHook?: string;
	disabled?: boolean;
	id?: string;
	inLineMessage?: string;
	label?: string;
	onClick?: React.MouseEventHandler;
	onClickAddButton?: React.MouseEventHandler<HTMLButtonElement>;
	onClickCanvas?: React.MouseEventHandler<HTMLDivElement>;
	onClickDeleteButton?: React.MouseEventHandler<HTMLButtonElement>;
	onClickEditButton?: React.MouseEventHandler<HTMLButtonElement>;
	onClickResetButton?: React.MouseEventHandler<HTMLButtonElement>;
	onMouseEnterPreview?: React.MouseEventHandler<HTMLDivElement>;
	onMouseLeavePreview?: React.MouseEventHandler<HTMLDivElement>;
	previewStyles?: React.CSSProperties;
	status?: StatusIndicatorProps["status"];
	statusContent?: string;
	type?: "color" | "custom" | "image" | "video";
};
