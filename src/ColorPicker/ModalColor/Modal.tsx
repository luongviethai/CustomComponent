import { memo } from "react";
import _ from "lodash";
import {
	Modal as ModalCore,
	CustomModalLayout,
	Text,
} from "@wix/design-system";

type ModalProps = {
	onAccept?: () => void;
	onCancel?: () => void;
	onClose?: () => void;
	shown?: boolean;
	title?: string;
	content?: string;
	primaryButtonText?: string;
	secondaryButtonText?: string;
};

function Modal(props: ModalProps) {
	const {
		content,
		onAccept,
		onCancel,
		onClose,
		primaryButtonText,
		secondaryButtonText,
		shown,
		title,
	} = props;

	const handleCloseModal = () => !_.isUndefined(onClose) && onClose();

	const handleSave = () => {
		!_.isUndefined(onAccept) && onAccept();
	};

	const handleCancel = () => !_.isUndefined(onCancel) && onCancel();

	return (
		<ModalCore
			isOpen={!_.isUndefined(shown) && shown}
			onRequestClose={handleCloseModal}
			shouldCloseOnOverlayClick
			screen="desktop"
		>
			<CustomModalLayout
				primaryButtonText={primaryButtonText}
				secondaryButtonText={secondaryButtonText}
				primaryButtonOnClick={handleSave}
				secondaryButtonOnClick={handleCancel}
				onCloseButtonClick={handleCloseModal}
				title={title}
				width="400px"
			>
				<Text>{content}</Text>
			</CustomModalLayout>
			;
		</ModalCore>
	);
}

export default memo(Modal);
