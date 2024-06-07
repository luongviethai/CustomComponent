import React from "react";

// import Heading from '../Heading';
// import Tooltip from '../Tooltip';
import { Heading, Tooltip } from "@wix/design-system";

import Arc from "./Arc";
import {
	ARCS_ANGLES,
	FULL_CIRCLE_ANGLE,
	SIZE_TO_ERROR_ICON,
	SIZES_IN_PIXEL,
	STROKE_WIDTHS,
} from "./constants";

import { classes, st } from "./Loader.st.css";

import type { LoaderProps as LoaderPropsCoreCore } from "./types";
import type { $Keys, Required } from "utility-types";

const defaultProps = {
	size: "medium",
	color: "blue",
	status: "loading",
};

type LoaderProps = Required<LoaderPropsCoreCore, $Keys<typeof defaultProps>>;

class Loader extends React.PureComponent<LoaderProps> {
	static displayName = "Loader";

	static defaultProps = defaultProps;

	render() {
		const { dataHook, size, color, text, status, statusMessage, className } =
			this.props;
		const sizeInPx = SIZES_IN_PIXEL[size];
		const shouldShowFullCircle = status !== "loading";
		const lightArcAngle = !shouldShowFullCircle
			? ARCS_ANGLES[size].light
			: FULL_CIRCLE_ANGLE;
		const darkArcAngle = !shouldShowFullCircle
			? ARCS_ANGLES[size].dark
			: FULL_CIRCLE_ANGLE;
		const shouldShowText = size !== "tiny";
		const successIcon = SIZE_TO_ERROR_ICON[size];
		const errorIcon = SIZE_TO_ERROR_ICON[size];
		const strokeWidth = STROKE_WIDTHS[size];

		const loader = (
			<div
				style={{
					width: `${sizeInPx}px`,
					height: `${sizeInPx}px`,
				}}
				className={classes.arcsContainer}
			>
				<Arc
					angle={lightArcAngle}
					className={classes.lightArc}
					strokeWidth={strokeWidth}
					viewBoxSize={sizeInPx}
				/>
				<Arc
					angle={darkArcAngle}
					className={classes.darkArc}
					strokeWidth={strokeWidth}
					viewBoxSize={sizeInPx}
				/>
				{status !== "loading" && (
					<div className={classes.statusIndicator}>
						{status === "success" && successIcon}
						{status === "error" && errorIcon}
					</div>
				)}
			</div>
		);

		return (
			<div
				className={st(classes.root, { size, color, status }, className)}
				data-color={color}
				data-hook={dataHook}
				data-size={size}
				data-status={status}
			>
				{statusMessage ? (
					<Tooltip
						appendTo="window"
						content={statusMessage}
						dataHook="loader-tooltip"
					>
						{loader}
					</Tooltip>
				) : (
					loader
				)}

				{/* Footer Text */}
				{shouldShowText && text && (
					<div className={classes.text}>
						<Heading appearance="H6" dataHook="loader-text">
							{this.props.text}
						</Heading>
					</div>
				)}
			</div>
		);
	}
}

export default Loader;
