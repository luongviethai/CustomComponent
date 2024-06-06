import {
	forwardRef,
	type HTMLAttributes,
	type MouseEvent,
	type ReactNode,
	useImperativeHandle,
	useRef,
} from "react";
import isFunction from "lodash/isFunction";
import $ from "jquery";

import { DRAGGABLE_CANCEL_CLASS_NAME } from "./constants";
import { getTranslateValues } from "./helpers";

export type DraggableProps = Omit<
	HTMLAttributes<HTMLElement>,
	"onDrag" | "onDragEnd" | "onDragStart"
> & {
	as?: any;
	children?: ReactNode | ReactNode[];
	dataHook?: string;
	disabled?: boolean;
	draggable?: boolean;
	onDrag: (x: number, y: number, e: React.MouseEvent) => void;
	onDragEnd?: (x: number, y: number, e: React.MouseEvent) => void;
	onDragStart?: (x: number, y: number, e: React.MouseEvent) => void;
	snapGrid?: boolean;
	snapGridHeight?: number;
	snapGridWidth?: number;
	x?: number;
	y?: number;
};

const isValidEvent = (e: MouseEvent | TouchEvent) => {
	const el = e.target as HTMLElement;
	return !(
		$(el).hasClass(DRAGGABLE_CANCEL_CLASS_NAME) ||
		$(el).closest(`.${DRAGGABLE_CANCEL_CLASS_NAME}`).length
	);
};

const Draggable = forwardRef<HTMLElement | undefined, DraggableProps>(
	(props, forwardRef) => {
		const {
			as: Component = "div",
			children,
			dataHook,
			disabled = false,
			draggable = true,
			onDrag,
			onDragEnd,
			onDragStart,
			onMouseDown,
			snapGrid = false,
			snapGridHeight = 20,
			snapGridWidth = 20,
			style,
			x = 0,
			y = 0,
			...rest
		} = props;

		let originalX = useRef(0).current;
		let originalY = useRef(0).current;
		let lastTranslateX = useRef(0).current;
		let lastTranslateY = useRef(0).current;
		const ref = useRef<HTMLElement>();

		useImperativeHandle(forwardRef, () => ref.current);

		const handleMouseMove = (e: any): void => {
			if (ref.current && (e?.type === "mousemove" || e?.type === "touchmove")) {
				e.preventDefault();
				const { clientX, clientY } = e;

				let xMove = clientX - originalX + lastTranslateX;
				let yMove = clientY - originalY + lastTranslateY;

				if (snapGrid) {
					xMove =
						lastTranslateX +
						Math.floor((clientX - originalX) / snapGridWidth) * snapGridWidth;
					yMove =
						lastTranslateY +
						Math.floor((clientY - originalY) / snapGridHeight) * snapGridHeight;
				}
				onDrag(xMove, yMove, e);
			}
		};

		const handleMouseUp = (e: any) => {
			const { clientX, clientY } = e;
			const x = clientX - originalX + lastTranslateX;
			const y = clientY - originalY + lastTranslateY;
			lastTranslateX = x;
			lastTranslateY = y;
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("touchmove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("touchend", handleMouseUp);
			isFunction(onDragEnd) && onDragEnd(x, y, e);
		};

		const handleMouseDown = (e: MouseEvent<HTMLElement>) => {
			if (onMouseDown) {
				onMouseDown(e);
			}
			if (draggable && !disabled && isValidEvent(e)) {
				const { clientX, clientY } = e;
				window.addEventListener("mousemove", handleMouseMove);
				window.addEventListener("touchmove", handleMouseMove);
				window.addEventListener("mouseup", handleMouseUp);
				window.addEventListener("touchend", handleMouseUp);
				originalX = clientX;
				originalY = clientY;

				const translateValues = getTranslateValues(e.target as HTMLElement);
				if (translateValues) {
					lastTranslateX = translateValues.x;
					lastTranslateY = translateValues.y;
				}
				isFunction(onDragStart) && onDragStart(x, y, e);
			}
		};

		return (
			<Component
				{...rest}
				ref={ref}
				style={{
					transform: `translate(${x || 0}px, ${y || 0}px)`,
					...style,
				}}
				data-hook={dataHook}
				onMouseDown={handleMouseDown}
			>
				{children}
			</Component>
		);
	}
);

export default Draggable;
