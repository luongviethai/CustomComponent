import { Radio } from "@wix/design-system";

export type DynamicRowRadioProps = {
	checked: boolean;
	setFieldValue: (name: string, value: boolean) => void;
};

function DynamicRowRadio(props: DynamicRowRadioProps) {
	const { checked, setFieldValue } = props;

	const handleCheck = () => setFieldValue("radio", !checked);

	return <Radio checked={checked} onChange={handleCheck} />;
}

export default DynamicRowRadio;
