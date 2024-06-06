import React, { useState, useRef, memo } from "react";
import _ from "lodash";
import Add from "wix-ui-icons-common/Add";
import Edit from "wix-ui-icons-common/Edit";
import {
  Box,
  Button,
  Input,
  type InputStatus,
  IconButton,
  Tooltip,
} from "@wix/design-system";
import { FIELD_CODE, FIELD_GROUP_ID, FIELD_NAME, FIELD_ID } from "../constants";
import { isValidHex } from "../utils";
import type { ColorPickerValue, ColorPickerGroup } from "../types";
import { st, classes } from "./FormInput.st.css";

type FormProps = {
  isExpanded?: boolean;
  group?: ColorPickerGroup;
  onCancel?: () => void;
  onClear?: () => void;
  onSubmit?: (values: ColorPickerValue) => void;
  openExpandForm?: () => void;
  onUpdate?: (values: ColorPickerValue) => void;
  handleChangeSelected?: (isSelected?: boolean) => void;
  values?: ColorPickerValue;
  valueOriginColorHex?: ColorPickerValue;
  isColor?: boolean;
  isValueColor?: boolean;
};

function Form(props: FormProps) {
  const {
    group,
    isExpanded,
    onCancel,
    onClear,
    onSubmit,
    openExpandForm,
    onUpdate,
    values,
    valueOriginColorHex,
    isColor,
    isValueColor,
    handleChangeSelected,
  } = props;
  const [isTyping, setTyping] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>("");
  const [isInputCodeValid, setInputCodeValid] = useState(true);
  const [isInputNameValid, setInputNameValid] = useState(true);
  const inputChangedTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const clear = () => {
    inputChangedTimeoutRef.current &&
      clearTimeout(inputChangedTimeoutRef.current);
    setTyping(false);
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(_.trim(e.target.value));
    setTyping(true);
    !_.isUndefined(handleChangeSelected) && handleChangeSelected(false);
    inputChangedTimeoutRef.current &&
      clearTimeout(inputChangedTimeoutRef.current);
    inputChangedTimeoutRef.current = setTimeout(() => {
      let code = inputValue;

      if (isValidHex(code) && !_.startsWith(code, "#")) code = `#${code}`;

      !_.isUndefined(onUpdate) &&
        onUpdate({
          ...values,
          [FIELD_CODE]: code,
        });
      clear();
    }, 500);
  };

  const handleBlur = () => {
    !_.isUndefined(handleChangeSelected) && handleChangeSelected(false);
    !_.isUndefined(onUpdate) &&
      onUpdate({
        ...values,
        [FIELD_CODE]:
          values && isColor
            ? values[FIELD_CODE]
            : isValueColor && valueOriginColorHex
            ? valueOriginColorHex[FIELD_CODE]
            : values && values[FIELD_CODE],
      });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    clear();
    !_.isUndefined(handleChangeSelected) && handleChangeSelected(false);
    !_.isUndefined(onUpdate) &&
      onUpdate({
        ...values,
        [FIELD_CODE]: _.get(values, FIELD_CODE, ""),
        [FIELD_NAME]: e.target.value,
      });
  };

  const handleSubmit = () => {
    clear();

    const isInputCodeValid = !!_.get(values, FIELD_CODE);
    const isInputNameValid = !!_.get(values, FIELD_NAME);

    if (isInputCodeValid && isInputNameValid)
      !_.isUndefined(onSubmit) &&
        onSubmit({ ...values, [FIELD_GROUP_ID]: group?.id });

    setInputCodeValid(isInputCodeValid);
    setInputNameValid(isInputNameValid);
  };

  const handleClear = () => {
    clear();
    _.isFunction(onClear) && onClear();
  };

  const handleCancel = () => {
    clear();
    _.isFunction(onCancel) && onCancel();
  };

  const getInputCodeProps = () => {
    const props: { status?: InputStatus } = {};
    if (!isInputCodeValid) props.status = "error";
    return props;
  };

  const getInputNameProps = () => {
    const props: { status?: InputStatus } = {};
    if (!isInputNameValid) props.status = "error";
    return props;
  };

  return (
    <>
      <Box
        direction="vertical"
        gap="12px"
        className={st(classes.root)}
        width="100%"
      >
        <Input
          value={isTyping ? inputValue : _.get(values, FIELD_CODE, "")}
          onChange={handleChangeCode}
          placeholder="Code"
          noRightBorderRadius={!isExpanded && group?.editable}
          clearButton={!isExpanded && group?.editable}
          onBlur={handleBlur}
          onClear={handleClear}
          {...getInputCodeProps()}
        />

        {isExpanded && (
          <>
            <Input
              value={_.get(values, FIELD_NAME, "")}
              onChange={handleChangeName}
              placeholder="Name"
              {...getInputNameProps()}
              autoFocus
            />
            <Box gap="12px">
              <Button size="small" priority="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="small" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </>
        )}
      </Box>

      {!isExpanded && group?.editable && (
        <Tooltip
          content={_.get(values, FIELD_ID) ? "Edit" : `Add To ${group.name}`}
        >
          <IconButton
            className={classes.addToGroupBtn}
            onClick={openExpandForm}
          >
            {_.find(group.editable ? group.colors : [], [
              FIELD_ID,
              _.get(values, FIELD_ID),
            ]) ? (
              <Edit width="28px" height="28px" />
            ) : (
              <Add width="28px" height="28px" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}

export default memo(Form);
