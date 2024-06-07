import { useState } from "react";
import { Box } from "@wix/design-system";
import Range from "./Range";
import $ from "jquery";
import DemoDynamicRows from "./DemoDynamicRows";
import BorderRadius from "./BorderRadius";
import ColorPicker from "./ColorPicker";
import DemoFontFamily from "./DemoFontFamily";

function App() {
	const [valueRange, setValueRange] = useState(0);
	const [valueBorderRadius, setValueBorderRadius] = useState({});
	const [valueColor, setValueColor] = useState({});

	const onClickEditButton = () => {
		$(".preview-picker #background-current-color")[0].click();
	};

	const onClickDeleteButton = () => setValueColor(undefined);
	const onClickResetButton = () => setValueColor({ code: "#3899EC" });

	return (
		<Box direction="vertical" width="500px" gap="SP4">
			<DemoFontFamily />
			<ColorPicker
				className="preview-picker"
				previewPicker
				isAlpha
				value={valueColor}
				setValue={setValueColor}
				id={"showPicker"}
				previewProps={{
					onClickEditButton,
					onClickDeleteButton,
					onClickResetButton,
				}}
			/>
			<DemoDynamicRows />
			<BorderRadius value={valueBorderRadius} setValue={setValueBorderRadius} />
			<Range value={valueRange} setValue={setValueRange} />
		</Box>
	);
}

export default App;
