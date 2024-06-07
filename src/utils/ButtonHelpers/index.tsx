import React from "react";
import { Layout, Cell, Box } from "@wix/design-system";
// import Box from "../../Box";

const skinBackgroundRules = [
	{
		when: (skin) => skin === "standard",
		output: "",
	},
	{
		when: (skin) => skin === "inverted",
		output: "",
	},
	{
		when: (skin) => skin === "destructive",
		output: "",
	},
	{
		when: (skin) => skin === "premium",
		output: "",
	},
	{
		when: (skin) => skin === "light",
		output: "#162d3d",
	},
	{
		when: (skin) => skin === "transparent",
		output: "#4eb7f5",
	},
	{
		when: (skin) => skin === "dark",
		output: "#fef0ba",
	},
	{
		when: (skin) => skin === "premium-light",
		output: "#162d3d",
	},
	{
		when: () => true,
		output: "",
	},
];

export const getSkinBackground = (skin) =>
	skinBackgroundRules.find(({ when }) => when(skin)).output;

export const renderButtonBlock = ({ Component, props = {}, skins }) => (
	<div
		style={{
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			backgroundColor: "#f0f4f7",
		}}
	>
		<Box width="400px">
			<Layout>
				<Cell span={6}>
					{skins.map(({ skin, background }, index) => (
						<div key={index} style={{ background, margin: "5px 0" }}>
							<Component children={skin} {...props} fullWidth skin={skin} />
						</div>
					))}
				</Cell>
				<Cell span={6}>
					{skins.map(({ skin, background }, index) => (
						<div key={index} style={{ background, margin: "5px 0" }}>
							<Component
								children={skin}
								{...props}
								fullWidth
								skin={skin}
								disabled
							/>
						</div>
					))}
				</Cell>
			</Layout>
		</Box>
	</div>
);
