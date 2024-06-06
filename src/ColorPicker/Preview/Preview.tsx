import { memo, useRef } from "react";
import _ from "lodash";

import {
	IconDelete,
	IconSettings,
	IconRevertReset,
	IconStatusAlertFilled,
	IconStatusWarningFilled,
} from "../../Icons";
import {
	AddItem,
	Box,
	IconButton,
	type IconButtonProps,
	MediaOverlay,
	StatusIndicator,
	Text,
} from "@wix/design-system";

import { dataHooks } from "./constants";

import { classes, st } from "./Preview.st.css";

import type { PreviewProps } from "./types";
import type React from "react";

function Preview(props: PreviewProps) {
	const {
		addTitle,
		children,
		className,
		dataHook,
		disabled = false,
		inLineMessage,
		label,
		onClickAddButton,
		onClickCanvas,
		onClickDeleteButton,
		onClickEditButton,
		onClickResetButton,
		onMouseEnterPreview,
		onMouseLeavePreview,
		previewStyles,
		status,
		statusContent,
		type,
		...rest
	} = props;
	const refPreview = useRef<HTMLDivElement>(null);

	const handleMouseEnter = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (disabled) return;
		onMouseEnterPreview && onMouseEnterPreview(e);
	};

	const handleMouseLeave = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (disabled) return;
		onMouseLeavePreview && onMouseLeavePreview(e);
	};

	const isHasValue = () => !_.isEmpty(previewStyles) || !!children;

	const handleClickDeleteButton = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		_.isFunction(onClickDeleteButton) && onClickDeleteButton(e);
	};

	const handleClickEditButton = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		_.isFunction(onClickEditButton) && onClickEditButton(e);
	};

	const handleClickResetButton = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		_.isFunction(onClickResetButton) && onClickResetButton(e);
	};

	const renderPreviewCanvas = () => (
		<div
			className={st(classes.canvas, "mb-preview-canvas")}
			data-canvas={!_.isEmpty(previewStyles) || children ? true : undefined}
			data-hook={dataHooks.canvas}
			style={previewStyles}
			onClick={!disabled ? onClickCanvas : undefined}
		>
			{!isHasValue() && addTitle && (
				<AddItem
					className={classes.addButton}
					dataHook={dataHooks.addButton}
					disabled={disabled}
					size="small"
					theme="plain"
					onClick={onClickAddButton}
				>
					{addTitle}
				</AddItem>
			)}
			{children}
		</div>
	);

	const renderWrapperIconButton = () => (
		<Box
			align="center"
			cursor="pointer"
			gap="3px"
			padding="6px 9px"
			verticalAlign="middle"
			width="100%"
		>
			{isHasValue() && (
				<>
					{onClickEditButton && renderAnimatedButton("edit")}
					{onClickDeleteButton && renderAnimatedButton("delete")}
					{onClickResetButton && renderAnimatedButton("reset")}
				</>
			)}
		</Box>
	);

	type ActionType = "delete" | "edit" | "reset";
	const renderAnimatedButton = (type: ActionType) => {
		const dataAttributes: Record<
			ActionType,
			{
				children: IconButtonProps["children"];
				dataHook: string;
				onClick: React.MouseEventHandler;
			}
		> = {
			edit: {
				dataHook: dataHooks.editButton,
				onClick: handleClickEditButton,
				children: <IconSettings />,
			},
			delete: {
				dataHook: dataHooks.deleteButton,
				onClick: handleClickDeleteButton,
				children: <IconDelete />,
			},
			reset: {
				dataHook: dataHooks.resetButton,
				onClick: handleClickResetButton,
				children: <IconRevertReset />,
			},
		};

		return (
			<IconButton
				className={classes.iconButton}
				priority="secondary"
				skin="light"
				{...dataAttributes[type]}
			>
				{dataAttributes[type].children}
			</IconButton>
		);
	};

	return (
		<>
			<div
				{...rest}
				ref={refPreview}
				className={st(
					classes.root,
					{
						showOverlay:
							!!isHasValue() &&
							!!(
								onClickEditButton ||
								onClickDeleteButton ||
								onClickResetButton
							),
						isEmpty: !isHasValue(),
						type,
						disabled,
						status,
					},
					className
				)}
				data-disabled={disabled}
				data-hook={dataHook}
				data-type={type}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{status && !inLineMessage && (
					<StatusIndicator
						className={classes.statusIndicator}
						dataHook={dataHooks.statusInside}
						message={statusContent}
						status={status}
						tooltipPlacement="top"
					/>
				)}

				{label && isHasValue() && (
					<Box
						className={classes.labelPreview}
						paddingLeft="6px"
						verticalAlign="middle"
					>
						<Text
							light
							className={classes.textLabel}
							dataHook={dataHooks.labelPreivew}
						>
							{label}
						</Text>
					</Box>
				)}

				{isHasValue() && !disabled ? (
					<MediaOverlay
						className={classes.mediaOverLay}
						hoverSkin="dark"
						media={renderPreviewCanvas()}
						onClick={onClickCanvas}
					>
						<MediaOverlay.Content visible="hover">
							{renderWrapperIconButton()}
						</MediaOverlay.Content>
					</MediaOverlay>
				) : (
					renderPreviewCanvas()
				)}
			</div>
			{status && inLineMessage && (
				<Box gap="3px" verticalAlign="middle" width="100%">
					{status === "error" && (
						<IconStatusAlertFilled
							className={classes.errorIcon}
							data-hook={dataHooks.statusErrorOutside}
						/>
					)}
					{status === "warning" && (
						<IconStatusWarningFilled
							className={classes.warningIcon}
							data-hook={dataHooks.statusWarningOutside}
						/>
					)}
					<Text
						dataHook={dataHooks.inLineMessage}
						skin={status === "error" ? "error" : undefined}
					>
						{inLineMessage}
					</Text>
				</Box>
			)}
		</>
	);
}

export default memo(Preview);
