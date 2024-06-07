import defaultTo from "lodash/defaultTo";
import isEqual from "lodash/isEqual";
import sortBy from "lodash/sortBy";
import InputWithOptions, {
	InputWithOptionsState,
	ManualInputFnSignature,
	OnSelectFnSignature,
} from "../InputWithOptions";
import type {
	DropdownLayoutOption,
	DropdownLayoutValueOption,
} from "../DropdownLayout";
import type { DropdownProps } from "./types";
import { st, classes } from "./Dropdown.st.css";

const NO_SELECTED_ID = null;

type DropdownState = InputWithOptionsState & {
	value: DropdownLayoutValueOption["value"];
	label: DropdownLayoutValueOption["label"];
	selectedId: DropdownLayoutValueOption["value"];
};

class Dropdown extends InputWithOptions<
	ManualInputFnSignature,
	OnSelectFnSignature,
	DropdownProps,
	DropdownState
> {
	static displayName = "Dropdown";
	static defaultProps = InputWithOptions.defaultProps;

	constructor(props: InputWithOptions["props"]) {
		super(props);

		this.state = {
			...this.state,
			// value: '',
			// selectedId: NO_SELECTED_ID,

			...Dropdown.getNextState(
				props,
				defaultTo(props.selectedId, props.initialSelectedId)
			),
		};
	}

	isSelectedIdControlled() {
		return typeof this.props.selectedId !== "undefined";
	}

	static isOptionsEqual(
		optionsA: DropdownLayoutOption[],
		optionsB: DropdownLayoutOption[]
	) {
		return isEqual(sortBy(optionsA, "id"), sortBy(optionsB, "id"));
	}

	getSelectedId() {
		return this.isSelectedIdControlled()
			? this.props.selectedId
			: this.state.selectedId;
	}

	_onInputClicked(event) {
		if (this.props.onInputClicked) {
			this.props.onInputClicked(event);
		}

		if (this.props.readOnly) {
			return;
		}

		if (
			this.state.showOptions &&
			Date.now() - this.state.lastOptionsShow > 200
		) {
			this.hideOptions();
		} else {
			this.showOptions();
		}
	}

	/**
	 * Updates the value by the selectedId.
	 * If selectedId is not found in options, then value is NOT changed.
	 */
	static getNextState(props, selectedId?: string) {
		if (typeof selectedId !== "undefined") {
			const option = props.options.find((_option) => {
				return _option.id === selectedId;
			});

			if (option) {
				const value = props.valueParser(option) || "";
				return { value, selectedId };
			}
		}

		return { value: "", selectedId: NO_SELECTED_ID };
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (
			nextProps.selectedId !== this.props.selectedId ||
			!Dropdown.isOptionsEqual(this.props.options, nextProps.options)
		) {
			this.setState(Dropdown.getNextState(nextProps, nextProps.selectedId));
		}
	}

	inputClasses() {
		const { noBorder } = this.props;
		return st(classes.showPointer, { noBorder });
	}

	dropdownAdditionalProps() {
		const { options, searchable, emptyStateMessage } = this.props;
		if (searchable && emptyStateMessage && options.length === 0) {
			return {
				options: [
					{
						id: "empty-state-message",
						value: emptyStateMessage,
						disabled: true,
					},
				],
			};
		}

		return {
			selectedId: this.getSelectedId(),
			value: this.state.value,
			tabIndex: -1,
			withArrow: false,
		};
	}

	inputAdditionalProps() {
		return {
			disableEditing: true,
			value: this.state.value,
		};
	}

	_onSelect(option) {
		if (!this.isSelectedIdControlled()) {
			this.setState({
				value: this.props.valueParser(option),
				selectedId: option.id,
			});
		}
		super._onSelect(option);
	}

	_onChange(event) {
		this.setState({ value: event.target.value });
		super._onChange(event);
	}
}

export default Dropdown;
