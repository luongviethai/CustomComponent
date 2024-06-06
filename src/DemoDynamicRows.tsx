import { useState } from "react";
import _ from "lodash";
import DynamicRowRadio from "./DynamicRows/DynamicRowRadio";
import { Input, DatePicker } from "@wix/design-system";
import { format } from "date-fns";
import DynamicRows from "./DynamicRows";

export const toDate = (date?: string) => (date ? new Date(date) : undefined);
export const formatDate = (date: Date | number, formatStr = "yyyy-MM-dd") =>
	format(date, formatStr);

function ChildrenElementInput(props: any) {
	const { setFieldValue, value } = props;

	const handleChangeValue = (e: any) => {
		if (_.isFunction(setFieldValue)) {
			setFieldValue("input", e.target.value);
		}
	};

	return <Input value={value} onChange={handleChangeValue} />;
}

function ChildrenElementDate(props: any) {
	const { setFieldValue, value } = props;

	const handleChangeValue = (value: any) => {
		if (_.isFunction(setFieldValue)) {
			setFieldValue("date", formatDate(value));
		}
	};

	return (
		<DatePicker
			value={toDate(value)}
			width="100%"
			onChange={handleChangeValue}
		/>
	);
}

function DemoDynamicRows() {
	const [items, setItems] = useState([
		{
			id: "j6edb5q",
			title: "Item 1",
			input: "a",
			date: "2024-05-02",
		},
		{
			id: "1m2pq46",
			title: "Item 2",
			input: "ádád",
			date: "2024-05-24",
		},
	]);

	return (
		<DynamicRows setValue={setItems} value={items}>
			{({ item, setFieldValue }) => (
				<>
					<DynamicRowRadio checked={item.radio} setFieldValue={setFieldValue} />
					<ChildrenElementInput
						setFieldValue={setFieldValue}
						value={item.input}
					/>
					<ChildrenElementDate
						setFieldValue={setFieldValue}
						value={item.date}
					/>
				</>
			)}
		</DynamicRows>
	);
}

export default DemoDynamicRows;
