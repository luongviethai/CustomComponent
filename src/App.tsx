import { useState } from "react";
import { Box } from "@wix/design-system";
import Range from "./Range";
import DemoDynamicRows from "./DemoDynamicRows";
import FontFamily from "./FontFamily";
import BorderRadius from "./BorderRadius";
import ColorPicker from "./ColorPicker";
import DemoColor from "./DemoColor";

function App() {
	const [valueRange, setValueRange] = useState(0);
	const [valueBorderRadius, setValueBorderRadius] = useState({});
	const [valueColor, setValueColor] = useState({});

	const fontVendors = {
		google: {
			id: "google",
			name: "Google Fonts",
			fonts: {
				AbhayaLibre: {
					family: "Abhaya Libre",
					variants: ["500"],
					files: { "500": "ddd" },
				},
				Roboto: {
					family: "Roboto",
					variants: ["500"],
					files: { "500": "ddd" },
				},
				Aleo: { family: "Aleo", variants: ["500"], files: { "500": "ddd" } },
			},
		},
		local: {
			id: "local",
			name: "Local Fonts",
			fonts: {
				Font1: { family: "Font1", variants: ["700"], files: { "700": "ddd" } },
				Font2: { family: "Font2", variants: ["700"], files: { "700": "ddd" } },
				Font3: {
					family: "Font3",
					variants: ["500", "700"],
					files: { "500": "ddd", "700": " sss" },
				},
				Font4: {
					family: "Font4",
					variants: ["500", "700"],
					files: { "500": "ddd", "700": " sss" },
				},
			},
		},
	};


	return (
		<Box direction="vertical" width="500px">
			{/* <ColorPicker
				value={valueColor}
				setValue={setValueColor}
				isAlpha
				previewPicker
			/> */}
	
			<DemoColor />	
			{/* <DemoDynamicRows />
			<Range value={valueRange} setValue={setValueRange} />
			<BorderRadius value={valueBorderRadius} setValue={setValueBorderRadius} /> */}
			{/* <FontFamily fontVendors={fontVendors} id={"demo"} /> */}
		</Box>
	);
}

export default App;
