export type ListItemSectionTypes =
	| "whitespace"
	| "divider"
	| "title"
	| "subheader";

export interface ListItemSectionProps {
	/** Applied as data-hook HTML attribute that can be used in the tests */
	dataHook?: string;

	/** A css class to be applied to the component's root element */
	className?: string;

	/** A list item section can be
	 *  * `title` - Acts as a title for following list items.
	 *  * `subheader` - Acts as separator between list items for differentiation.
	 *  * `whitespace` - Adds some padding between list items.
	 *  * `divider` - Same as whitespace, but with a line.
	 */
	type?: ListItemSectionTypes;

	/** Text of the list item */
	title?: React.ReactNode | string;

	/** Suffix node. Renders TextButton for a string otherwise the node itself. */
	suffix?: React.ReactNode;

	/** If true, long text won't break into more than one line and will be terminated with an ellipsis */
	ellipsis?: boolean;

	/** A callback function called when suffix is clicked */
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
}

export type OptionRender = {
	id: string | number;
	disabled?: boolean;
	overrideOptionStyle: boolean;
	label?: string;
	value: (props: Partial<ListItemSectionProps>) => React.ReactNode;
};
