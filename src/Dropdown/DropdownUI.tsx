import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import axios from "axios";
import PropTypes from "prop-types";

import { listItemSectionBuilder } from "../ListItemSection";
// import Search from "../Search";
import { Search } from "@wix/design-system";
import Dropdown from "./Dropdown";

import { classes, st } from "./DropdownUI.st.css";

import type { OptionRender } from "../ListItemSection";
import type { DropdownProps } from "./types";
import type { DropdownLayoutOption } from "../DropdownLayout";
import type { ChangeEvent } from "react";

/**
 * Prepare options
 * @param {Array} options Options of dropdown
 * @param {Array} flatOptions New Options when prepare complete
 * @param {number} level Flag level for all option
 * @returns flatOptions
 */

export type OptionProps = DropdownLayoutOption & {
	opt?: DropdownLayoutOption[];
};

const prepareOptions = (
	options: OptionProps[],
	flatOptions?: OptionProps[],
	level?: number
) => {
	const newFlatOptions: OptionProps[] = flatOptions || [];
	const newLevel = _.isUndefined(level) ? 0 : level;

	_.each(options, (option) => {
		const tempOption = { ...option, level: newLevel };
		if (!_.isEmpty(tempOption.opt) && !_.isUndefined(tempOption.opt)) {
			const nodeOption = listItemSectionBuilder({
				id: option.id,
				title: tempOption.title,
				type: "title",
			}) as OptionProps & OptionRender;

			if (nodeOption) nodeOption.level = newLevel;

			newFlatOptions.push(nodeOption);
			prepareOptions(tempOption.opt, newFlatOptions, newLevel + 1);
		} else {
			newFlatOptions.push(tempOption);
		}
	});

	return newFlatOptions;
};

function DropdownRender(props: DropdownProps) {
	const {
		options,
		selectedId,
		fixedHeader,
		searchable,
		searchDebounce,
		searchUrl,
		searchPlaceholder,
		searchAutoFocus,
		searchParams,
		searchDebounceDefault,
		defaultEmptyStateMessage,
		emptyStateMessage,
		onSelect,
		loadMore,
		dataHook,
		...rest
	} = props;

	const rootRef = useRef<Dropdown | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const firstUpdate = useRef(true);
	const [searchText, setSearchText] = useState("");
	const [selectedOption, setSelectedOption] = useState<{ value?: string }>({});
	const [currentOptions, setCurrentOptions] = useState<any[]>();
	const [hasMore, setHasMore] = useState(true);

	const fetchMoreData = useCallback(
		(
			offsetPage?: number,
			text?: string,
			customParams?: { initSelected?: string; isFirstLoad?: boolean }
		) => {
			if (searchUrl) {
				axios
					.get<{
						hasMore: boolean;
						selectedOption: any;
						options: [];
					}>(searchUrl, {
						params: {
							limit: 5,
							searchText: text,
							...customParams,
							...searchParams,
							offset: offsetPage,
						},
					})
					.then((response) => {
						setHasMore(response.data.hasMore);
						if (customParams?.isFirstLoad) {
							if (
								_.isEmpty(response.data.selectedOption) &&
								_.isEmpty(searchText)
							) {
								setCurrentOptions([
									{
										id: "empty-state-message",
										value: defaultEmptyStateMessage,
										disabled: true,
									},
								]);
							} else setCurrentOptions([response.data.selectedOption]);
						} else {
							setCurrentOptions(response.data.options);
						}

						if (!_.isEmpty(response.data.selectedOption)) {
							setSelectedOption(response.data.selectedOption);
						}
					})
					.catch((error) => console.log(error));
			}
		},
		[defaultEmptyStateMessage, searchParams, searchText, searchUrl]
	);

	useEffect(() => {
		if (searchUrl) {
			if (firstUpdate.current)
				fetchMoreData(0, "", {
					initSelected: _.toString(selectedId),
					isFirstLoad: true,
				});
			else fetchMoreData(0, "", { initSelected: _.toString(selectedId) });
		}
	}, [fetchMoreData, searchUrl, selectedId]);

	const getOptions = useCallback(() => {
		if (searchUrl) return currentOptions;
		if (!_.isEmpty(searchText)) {
			return _.filter(
				_.map(options, (_option) => ({ ..._option, level: 0 })),
				(option) =>
					option.id &&
					_.includes(
						_.toLower(
							option.value &&
								(_.isString(option.value) || _.isNumber(option.value))
								? _.toString(option?.value)
								: option?.label
						),
						_.toLower(searchText)
					) &&
					!option.disabled
			);
		}

		return options;
	}, [currentOptions, options, searchText, searchUrl]);

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		if (searchUrl) {
			firstUpdate.current = false;
			fetchMoreData(0, e.target.value);
		}
	};

	const handleSearchClear = () => {
		setSearchText("");
		fetchMoreData(0, "");
	};

	const handleSearchKeyDown = (event: { key?: KeyboardEvent["key"] }) => {
		if (event.key && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
			inputRef?.current?.focus();
		}
	};

	const customInput = useCallback(
		(inputProps) => {
			const optionHasSelect = _.find(
				options,
				(option) => option.id === selectedId
			);
			let newValue = optionHasSelect?.label || optionHasSelect?.value || "";
			if (searchUrl)
				newValue = selectedId ? _.toString(selectedOption?.value) : "";
			return <input ref={inputRef} {...inputProps} value={newValue} />;
		},
		[options, selectedOption?.value, searchUrl, selectedId]
	);

	const searchDeBounce = useMemo(() => {
		if (searchDebounce) return { debounceMs: searchDebounce };
		return searchUrl ? { debounceMs: searchDebounceDefault } : {};
	}, [searchDebounce, searchDebounceDefault, searchUrl]);

	const handleLoadMore = () => {
		if (_.isFunction(loadMore)) loadMore();
		if (searchUrl) fetchMoreData(currentOptions?.length, searchText);
	};

	const handleOnSelect = (option: DropdownLayoutOption[]) => {
		setSearchText("");
		if (_.isFunction(onSelect)) onSelect(option);
	};

	return (
		<div className={st(classes.root)} data-hook={dataHook}>
			<Dropdown
				{...rest}
				ref={rootRef}
				emptyStateMessage={
					searchText !== ""
						? emptyStateMessage + searchText
						: defaultEmptyStateMessage
				}
				fixedHeader={
					<>
						{searchable && (
							<Search
								native
								autoFocus={searchAutoFocus}
								border="bottomLine"
								placeholder={searchPlaceholder}
								size="medium"
								value={searchText}
								onChange={handleSearchChange}
								onClear={handleSearchClear}
								onKeyDown={handleSearchKeyDown}
								{...searchDeBounce}
							/>
						)}
						{fixedHeader}
					</>
				}
				customInput={props?.customInput ? props?.customInput : customInput}
				hasMore={searchUrl ? hasMore : props.hasMore}
				infiniteScroll={searchUrl ? !!searchUrl : props.infiniteScroll}
				loadMore={searchUrl ? handleLoadMore : props.loadMore}
				options={getOptions()}
				searchable={searchable}
				selectedId={selectedId}
				onSelect={handleOnSelect}
			/>
		</div>
	);
}

function DropdownUI(config: DropdownProps) {
	const { options, ...rest } = config;
	return (
		<DropdownRender {...rest} options={options && prepareOptions(options)} />
	);
}

DropdownRender.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string,
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		})
	),
	selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	searchPlaceholder: PropTypes.string,
	searchAutoFocus: PropTypes.bool,
	fixedHeader: PropTypes.node,
	searchable: PropTypes.bool,
	searchUrl: PropTypes.string,
	searchParams: PropTypes.object,
	searchDebounce: PropTypes.number,
	searchDebounceDefault: PropTypes.number,
	emptyStateMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	defaultEmptyStateMessage: PropTypes.string,
	onSelect: PropTypes.func,
	loadMore: PropTypes.func,
};

DropdownUI.defaultProps = {
	searchPlaceholder: "Search Text ...",
	searchAutoFocus: true,
	emptyStateMessage: "Couldn't find: ",
	defaultEmptyStateMessage: "Enter your search keyword",
	searchDebounceDefault: 500,
};

export default DropdownUI;
