import { useState, useRef } from "react";
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
	const colorRef = useRef<HTMLElement>(null);

	const onClickEditButton = () => {
		if (colorRef.current) {
			colorRef.current.click();
		}
	};

	const onClickDeleteButton = () => setValueColor(undefined);
	const onClickResetButton = () => setValueColor({ code: "#3899EC" });

	return (
		<Box direction="vertical" width="500px" gap="SP4">
			<DemoFontFamily />
			<ColorPicker
				innerRef={colorRef}
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
