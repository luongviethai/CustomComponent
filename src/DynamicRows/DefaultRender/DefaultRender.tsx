import { IconDuplicate, IconSettings, IconDelete, IconDrag } from "../../Icons";
import {
	Box,
	type BoxProps,
	Text,
	TextButton,
	Tooltip,
} from "@wix/design-system";

import { dataHooks } from "../constants";
import type { Item } from "../DynamicRows";

import { classes, st } from "./DefaultRender.st.css";

export type DefaultRenderProps = {
	boxStyleProps: Omit<BoxProps, "direction">;
	children?: any;
	connectHandle: any;
	disableDelete?: boolean;
	disableDuplicate?: boolean;
	disabled?: boolean;
	handleDelete: (e: React.MouseEvent, item: Item) => void;
	handleDuplicate: (e: React.MouseEvent, item: Item) => void;
	handleEdit: (e: React.MouseEvent, item: Item) => void;
	index: number;
	isPreview?: boolean;
	item: Item;
	name?: string;
	showFields: boolean;
	title: string;
};

function DefaultRender(props: DefaultRenderProps) {
	const {
		boxStyleProps,
		children,
		connectHandle,
		disableDelete,
		disableDuplicate,
		disabled,
		handleDelete,
		handleDuplicate,
		handleEdit,
		index,
		isPreview,
		item,
		showFields,
		title,
	} = props;

	const renderDragIcon = () => (
		<div>
			<TextButton
				className={st(classes.iconsDynamic, classes.iconDrag)}
				dataHook={`${dataHooks.dragable}-${index}`}
				disabled={disabled}
				skin="dark"
			>
				<Box align="center" verticalAlign="middle">
					<IconDrag />
				</Box>
			</TextButton>
		</div>
	);

	return (
		<Box
			{...boxStyleProps}
			boxSizing="border-box"
			className={st(classes.root, { disabled })}
			dataHook={`${dataHooks.dynamicItem}-${index}`}
			direction="vertical"
			paddingBottom="6px"
			paddingTop="6px"
			verticalAlign="middle"
		>
			<Box gap="6px" height={24} paddingRight="6px" verticalAlign="middle">
				<Box
					overflow="hidden"
					textOverflow="ellipsis"
					width="100%"
					height={"24px"}
				>
					{disabled ? renderDragIcon() : connectHandle(renderDragIcon())}
					{isPreview && renderDragIcon()}
					<Text
						ellipsis
						className={st(classes.title, { disabled })}
						dataHook={`${dataHooks.title}-${index}`}
					>
						{title}
					</Text>
				</Box>
				<Box align="right" gap="3px" height={24}>
					<Tooltip content={"Settings"}>
						<TextButton
							className={classes.iconsDynamic}
							dataHook={dataHooks.settings}
							disabled={disabled}
							skin="dark"
							onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
								handleEdit(e, item)
							}
						>
							<Box align="center" verticalAlign="middle">
								<IconSettings />
							</Box>
						</TextButton>
					</Tooltip>
					{!disableDuplicate && (
						<Tooltip content={"Duplicate"}>
							<TextButton
								className={classes.iconsDynamic}
								dataHook={dataHooks.duplicate}
								disabled={disabled}
								skin="dark"
								onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
									handleDuplicate(e, item)
								}
							>
								<Box align="center" verticalAlign="middle">
									<IconDuplicate />
								</Box>
							</TextButton>
						</Tooltip>
					)}
					{!disableDelete && (
						<Tooltip content={"Delete"}>
							<TextButton
								className={classes.iconsDynamic}
								dataHook={dataHooks.delete}
								disabled={disabled}
								skin="dark"
								onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
									handleDelete(e, item)
								}
							>
								<Box align="center" verticalAlign="middle">
									<IconDelete />
								</Box>
							</TextButton>
						</Tooltip>
					)}
				</Box>
			</Box>
			{showFields && (
				<Box direction="vertical" gap="12px" padding="12px">
					{children}
				</Box>
			)}
		</Box>
	);
}

export default DefaultRender;
