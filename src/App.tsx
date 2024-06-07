import { useState } from "react";
import { Box } from "@wix/design-system";
import Range from "./Range";
import DemoDynamicRows from "./DemoDynamicRows";
import BorderRadius from "./BorderRadius";
import ColorPicker from "./ColorPicker";
import DemoFontFamily from "./DemoFontFamily";

function App() {
	const [valueRange, setValueRange] = useState(0);
	const [valueBorderRadius, setValueBorderRadius] = useState({});
	const [valueColor, setValueColor] = useState({});

	return (
		<Box direction="vertical" width="500px" gap="SP4">
			<ColorPicker
				value={valueColor}
				setValue={setValueColor}
				isAlpha
				previewPicker
			/>
			<DemoDynamicRows />
			<BorderRadius value={valueBorderRadius} setValue={setValueBorderRadius} />
			<Range value={valueRange} setValue={setValueRange} />
			<DemoFontFamily />
		</Box>
	);
}

export default App;
