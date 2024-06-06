import React from "react";
import ColorPicker from "./ColorPicker";
import _ from "lodash";

function DemoColor() {
	const colorsEdit = [
		{
			name: "Black",
			code: "#000000",
		},
		{
			name: "Dark Gray 4",
			code: "#434343",
		},
		{
			name: "Dark Gray 3",
			code: "#666666",
		},
		{
			name: "Dark Gray 2",
			code: "#999999",
		},
		{
			name: "Dark Gray 1",
			code: "#b7b7b7",
		},
		{
			name: "Gray",
			code: "#cccccc",
		},
		{
			name: "Light Gray 1",
			code: "#d9d9d9",
		},
	];

	function prepareColors() {
		const arr500Colors = [];

		for (let index = 0; index <= 504; index++) {
			arr500Colors.push({
				name: index.toString(),
				code: "#" + Math.floor(Math.random() * 16777215).toString(16),
				id: index,
				groupId: "global",
			});
		}

		return [
			{
				name: "Preset",
				id: "preset",
				colors: colorsEdit,
			},
			{
				name: "Global",
				id: "global",
				editable: true,
				colors: arr500Colors,
				modal: {
					title: "Are you sure?",
					content:
						"You've made changes to this global color. This will affect all instances of this global color across your entire site. Do you wish to proceed?",
					primaryButtonText: "Save",
					secondaryButtonText: "Cancel",
				},
			},
			{
				name: "Recent",
				id: "recent",
				colors: [],
			},
		];
	}
	const [groups, setGroups] = React.useState(() => prepareColors());
	const [value, setValue] = React.useState({ code: "#1EA7FD" });

	const handleChangeValue = (color) => {
		setValue(color);
	};

	const handleDeleteColor = (color) => {
		if (color) {
			const newGroups = _.cloneDeep(groups);
			const indexGruopEditable = _.findIndex(newGroups, ["editable", true]);
			newGroups[indexGruopEditable].colors = _.filter(
				newGroups[indexGruopEditable].colors,
				(_color) => _color.id !== color.id
			);
			setGroups(newGroups);
		}
	};

	const handleAddColor = (color) => {
		if (color) {
			const newGroups = _.cloneDeep(groups);
			const indexGruopEditable = _.findIndex(newGroups, ["editable", true]);
			if (!_.find(newGroups[indexGruopEditable].colors, ["id", color.id])) {
				if (_.size(newGroups[indexGruopEditable].colors) < 1000) {
					newGroups[indexGruopEditable].colors.push({
						...color,
						id: _.uniqueId(),
					});
				}
			} else {
				newGroups[indexGruopEditable].colors = _.map(
					newGroups[indexGruopEditable].colors,
					(_color) => (_color.id === color.id ? { ...color } : _color)
				);
			}
			setGroups(newGroups);
		}
	};

	return (
		<ColorPicker
			isAlpha
			value={value}
			groups={groups}
			setValue={handleChangeValue}
			onDeleteColor={handleDeleteColor}
			onAddColor={handleAddColor}
			id={"500colors"}
		/>
	);
}

export default DemoColor;
