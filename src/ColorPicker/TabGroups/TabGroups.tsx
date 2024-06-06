import { Fragment, memo } from "react";
import _ from "lodash";
import Settings from "wix-ui-icons-common/Settings";
import { TextButton, Box } from "@wix/design-system";
import type { ColorPickerGroup } from "../types";
import { dataHooks } from "../constants";
import { st, classes } from "./TabGroups.st.css";

type TabGroupsProps = {
	groups?: ColorPickerGroup[];
	handleActiveTab?: (group: ColorPickerGroup) => void;
	handleToggleSwatchActions?: () => void;
	showPalette?: boolean;
	disabled?: boolean;
	showSwatchActions?: boolean;
	activedGroupId?: string;
};

function TabGroups(props: TabGroupsProps) {
	const {
		groups,
		showPalette,
		handleActiveTab,
		activedGroupId,
		disabled,
		showSwatchActions,
		handleToggleSwatchActions,
	} = props;

	return (
		<Box className={st(classes.root, { disabled })} verticalAlign="middle">
			<div style={{ flex: 1 }} />
			{showPalette &&
				_.map(groups, (group) => (
					<Fragment key={group.id}>
						<TextButton
							size="small"
							className={st(classes.tab, {
								actived: group.id === activedGroupId,
							})}
							onClick={() =>
								_.isFunction(handleActiveTab) && handleActiveTab(group)
							}
							dataHook={dataHooks.nameGroup}
							selected={group.id === activedGroupId}
							disabled={disabled}
						>
							{group.name}
						</TextButton>
						{group.editable && activedGroupId === group.id && (
							<div
								style={{ height: 0 }}
								className={st(classes.activeEdittingBtn, {
									actived: showSwatchActions,
								})}
							>
								<Settings
									width="24px"
									height="24px"
									style={{
										transform: "translate(-5px, -50%)",
									}}
									onClick={handleToggleSwatchActions}
									data-hook={dataHooks.showActionsGroup}
								/>
							</div>
						)}
					</Fragment>
				))}
		</Box>
	);
}

export default memo(TabGroups);
