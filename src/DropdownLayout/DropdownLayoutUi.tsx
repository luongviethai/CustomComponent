import _ from "lodash";
import {
	InfiniteLoader,
	CellMeasurer,
	List,
	AutoSizer,
	CellMeasurerCache,
} from "react-virtualized";
import DropdownLayout, { DropdownLayoutProps } from "./DropdownLayout";
import { classes } from "./DropdownLayoutUi.st.css";
import { STATUS_LOADED, STATUS_LOADING } from "./constants";

const cache = new CellMeasurerCache({
	defaultHeight: 36,
	fixedWidth: true,
});

class DropdownLayoutUi extends DropdownLayout {
	private _listRef: List | undefined;
	private _timeoutIdMap: {};
	constructor(props: DropdownLayoutProps) {
		super(props);
		this._timeoutIdMap = {};
		this._setListRef = this._setListRef.bind(this);
		this._renderOption = this._renderOption.bind(this);
	}

	_renderOptions(): JSX.Element[] | JSX.Element {
		this.focusableItemsIdsList = [];
		this._saveOnClicks();
		const {
			listProps,
			optionRenderer,
			options,
			virtualization,
			infiniteLoader,
			rowHeight,
		} = this.props;
		const { loadedRowsMap } = this.state;
		const height = this._calculateListHeight({ options });
		const innerRowRenderer = optionRenderer || this._renderOption;

		const _loadMoreRows = ({ startIndex, stopIndex }) => {
			const { loadedRowsMap, loadingRowCount } = this.state;
			const increment = stopIndex - startIndex + 1;

			for (let i = startIndex; i <= stopIndex; i++) {
				loadedRowsMap[i] = STATUS_LOADING;
			}

			this.setState({
				loadingRowCount: loadingRowCount + increment,
			});
			const timeoutId = window.setTimeout(() => {
				const { loadedRowCount, loadingRowCount } = this.state;

				delete this._timeoutIdMap[timeoutId];

				for (let i = startIndex; i <= stopIndex; i++) {
					loadedRowsMap[i] = STATUS_LOADED;
				}

				this.setState({
					loadingRowCount: loadingRowCount - increment,
					loadedRowCount: loadedRowCount + increment,
				});

				promiseResolver();
			}, 1000 + Math.round(Math.random() * 2000));

			this._timeoutIdMap[timeoutId] = true;

			let promiseResolver: (value?: unknown) => void;

			return new Promise((resolve) => {
				promiseResolver = resolve;
			});
		};

		const wrappedRowRenderer = ({ index, style, key, parent }) => {
			const { options } = this.props;
			const row = _.get(options, index);
			let content: {} | null | undefined;

			if (
				loadedRowsMap[index] === STATUS_LOADED ||
				_.isUndefined(loadedRowsMap[index])
			) {
				content = innerRowRenderer({
					idx: index,
					option: row,
					key,
					style,
				});
			} else {
				content = (
					<div style={style} key={key}>
						<div
							style={{
								width: "100%",
								display: "flex",
								alignItems: "center",
								color: "#000",
								paddingLeft: "24px",
								paddingRight: "24px",
								height: `${rowHeight ? rowHeight : 37}px`,
								fontSize: "initial",
							}}
							key={key}
						>
							Loading...
						</div>
					</div>
				);
			}

			return (
				<CellMeasurer
					cache={cache}
					columnIndex={0}
					parent={parent}
					rowIndex={index}
				>
					{content}
				</CellMeasurer>
			);
		};

		return virtualization ? (
			<InfiniteLoader
				isRowLoaded={
					infiniteLoader ? ({ index }) => !!loadedRowsMap[index] : () => true
				}
				loadMoreRows={
					infiniteLoader
						? _loadMoreRows
						: () => {
								return new Promise(() => {
									return 0;
								});
						  }
				}
				rowCount={_.size(options)}
				threshold={17}
				minimumBatchSize={17}
			>
				{({ onRowsRendered }) => (
					<AutoSizer disableHeight>
						{({ width }) => {
							return (
								<List
									ref={this._setListRef}
									className={classes.list}
									height={height}
									onRowsRendered={onRowsRendered}
									overscanRowCount={10}
									rowCount={_.size(options)}
									rowHeight={cache.rowHeight}
									rowRenderer={wrappedRowRenderer}
									deferredMeasurementCache={cache}
									width={width}
									{...listProps}
								/>
							);
						}}
					</AutoSizer>
				)}
			</InfiniteLoader>
		) : (
			super._renderOptions()
		);
	}

	_markOptionAtIndex = (markedIndex: number) => {
		super._markOption(markedIndex);
		this._listRef?.scrollToRow(markedIndex);
	};

	_focusOnSelectedOption = () => {
		const { options, selectedId } = this.props;
		const focusedOptionIndex = _.findIndex(
			options,
			(option) => option.id === selectedId
		);
		if (selectedId && focusedOptionIndex > -1) {
			this._listRef?.scrollToRow(focusedOptionIndex);
			super._focusOnSelectedOption();
		}
	};

	_calculateListHeight({ options }) {
		const { maxHeight = 200 } = this.props;
		let height = 0;
		for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
			const optionHeight: number | undefined = this._getOptionHeight({
				option: options[optionIndex],
			});
			if (!_.isUndefined(optionHeight)) height += optionHeight;

			if (!_.isUndefined(maxHeight) && height > maxHeight) {
				return maxHeight;
			}
		}
		return height;
	}

	_getOptionHeight({ option }) {
		const { optionHeight = 40 } = this.props;
		return _.isFunction(optionHeight) ? optionHeight({ option }) : optionHeight;
	}

	_setListRef(ref: List) {
		this._listRef = ref;
	}
}

DropdownLayoutUi.defaultProps = {
	...DropdownLayout.defaultProps,
};

export default DropdownLayoutUi;
