import _ from "lodash";
import { getUniqueId } from "../helpers";
import {
	isValidElement,
	memo,
	useCallback,
	useMemo,
	useRef,
	useState,
} from "react";
import { Box, Button, SortableListBase } from "@wix/design-system";

import { dataHooks } from "./constants";
import DefaultRender, { type DefaultRenderProps } from "./DefaultRender";

import { classes, st } from "./DynamicRows.st.css";

import type { BaseProps, Value } from "./types";

export type ControlProps = BaseProps & {
	id?: string;
	name?: string;
	setValue: (value: Value) => void;
	value?: Value;
};

export type Item = {
	id: string;
	type: string;
};
const Control = (props: ControlProps) => {
	const {
		actions,
		addTitle = "Add Item",
		children,
		className,
		dataHook,
		disableDelete,
		disabled,
		dynamicTitle = "title",
		id,
		name,
		onAdd,
		onDelete,
		onDrop,
		onDuplicate,
		onEdit,
		setValue,
		showSettings = true,
		titlePrefix = "Item",
	} = props;
	const value = useMemo(
		() => (_.isArray(props.value) ? props.value : []),
		[props.value]
	);
	const [activeId, setActiveId] = useState<string | null>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);

	const itemStyleProps = {
		common: {
			width: "100%",
			minHeight: "42px",
			backgroundColor: "WHITE",
			borderWidth: "1px",
			borderStyle: "solid",
			borderColor: "B40",
			borderRadius: "6px",
			marginBottom: "6px",
		},
		regular: {
			backgroundColor: "WHITE",
		},
		placeholder: {
			borderStyle: "none",
			backgroundColor: "B50",
			marginBottom: "6px",
		},
		preview: {
			backgroundColor: "B50",
		},
	};

	const handleDrop = ({
		addedIndex,
		payload,
		removedIndex,
	}: {
		addedIndex: number;
		payload: any;
		removedIndex: number;
	}) => {
		if (onDrop) {
			onDrop(payload, addedIndex);
		} else {
			const newValue = _.cloneDeep(value);
			newValue.splice(addedIndex, 0, ...newValue.splice(removedIndex, 1));
			setValue(newValue);
		}
	};

	const handleAddItem = useCallback(() => {
		const row = {
			id: getUniqueId(),
			title: `${titlePrefix} ${_.size(value) + 1}`,
		};
		if (onAdd) {
			onAdd(row);
		} else {
			setValue([
				..._.cloneDeep(value),
				{ id: getUniqueId(), title: `${titlePrefix} ${_.size(value) + 1}` },
			]);
		}
	}, [onAdd, setValue, titlePrefix, value]);

	const handleDuplicate = useCallback(
		(e: React.MouseEvent, item: Item) => {
			e.stopPropagation();
			if (onDuplicate) {
				onDuplicate(item.id);
			} else {
				const newValue = _.cloneDeep(value);
				const index = _.findIndex(value, (_item) => _item.id === item.id);
				if (index !== -1) {
					const newItem = {
						...item,
						id: getUniqueId(),
					};
					newValue.splice(index + 1, 0, newItem);
					setValue(newValue);
				}
			}
		},
		[setValue, onDuplicate, value]
	);

	const handleDelete = useCallback(
		(e: React.MouseEvent, item: Item) => {
			e.stopPropagation();
			if (item.id === activeId) {
				setActiveId("");
			}
			if (onDelete) {
				onDelete(item.id);
			} else {
				setValue(_.filter(value, (_item) => _item.id !== item.id));
			}
		},
		[activeId, setValue, onDelete, value]
	);

	const handleEdit = useCallback(
		(_e: React.MouseEvent, item: Item) => {
			setActiveId(activeId === item.id ? null : item.id);
			if (_.isFunction(onEdit)) {
				onEdit(item.id);
			}
		},
		[activeId, onEdit]
	);

	const getItemTitle = useCallback(
		(index: number, item: Item) =>
			dynamicTitle
				? _.get(item, dynamicTitle) || `${titlePrefix} #${index + 1}`
				: `${titlePrefix} #${index + 1}`,
		[dynamicTitle, titlePrefix]
	);

	const handleFieldValue = useCallback(
		(name: string, _value, item) => {
			if (_.isFunction(setValue)) {
				let newValue = _.cloneDeep(value);
				const valueItem = _.find(newValue, (_item) => _item.id === item.id);
				if (name === "radio") {
					newValue = _.map(newValue, (row) => {
						if (row.radio) {
							return { ...row, radio: false };
						}
						return row;
					});
				}
				if (valueItem) {
					_.set(valueItem, name, _value);
				}

				setValue(newValue);
			}
		},
		[setValue, value]
	);

	const renderChildren = useCallback(
		(item: any) =>
			isValidElement(children)
				? children
				: children({
						item,
						setFieldValue: (name: string, value: any) =>
							handleFieldValue(name, value, item),
				  }),
		[children, handleFieldValue]
	);

	const renderItem = useCallback(
		({ connectHandle, isPlaceholder, isPreview, item }) => {
			let styles: any = {};
			if (isPlaceholder) {
				styles = itemStyleProps.placeholder;
			} else if (isPreview) {
				styles = itemStyleProps.preview;
			} else {
				styles = itemStyleProps.regular;
			}
			if (wrapperRef.current && isPreview) {
				styles.width = wrapperRef.current.clientWidth;
			}
			styles.maxWidth = "100%";

			const index = _.findIndex(value, (_item) => _item.id === item.id);

			const style = {
				...itemStyleProps.common,
				...styles,
			};

			if (isPlaceholder) {
				return (
					<Box
						{...style}
						boxSizing="content-box"
						direction="vertical"
						marginBottom="6px"
					/>
				);
			}

			const dynamicFieldProps: DefaultRenderProps = {
				boxStyleProps: style,
				connectHandle,
				title: getItemTitle(index, item),
				handleEdit,
				handleDuplicate,
				handleDelete,
				item,
				showFields: !!showSettings && activeId === item.id,
				name,
				index,
				disableDelete,
				disabled,
				isPreview,
			};

			return (
				<DefaultRender {...dynamicFieldProps}>
					{renderChildren(item)}
				</DefaultRender>
			);
		},
		[
			value,
			itemStyleProps.common,
			itemStyleProps.placeholder,
			itemStyleProps.preview,
			itemStyleProps.regular,
			getItemTitle,
			handleEdit,
			handleDuplicate,
			handleDelete,
			showSettings,
			activeId,
			name,
			disableDelete,
			disabled,
			renderChildren,
		]
	);

	return (
		<div
			ref={wrapperRef}
			className={st(classes.root, className)}
			data-disabled={disabled}
			data-hook={dataHook}
		>
			<SortableListBase
				withHandle
				containerId={id}
				dataHook={dataHooks.sortableList}
				items={value}
				renderItem={renderItem}
				onDrop={handleDrop}
			/>
			{actions || (
				<Box gap="12px">
					<Button
						dataHook={dataHooks.addItem}
						disabled={!!disabled}
						size="small"
						onClick={handleAddItem}
					>
						{addTitle}
					</Button>
				</Box>
			)}
		</div>
	);
};

export default memo(Control);
