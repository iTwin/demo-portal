/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  Button,
  LabeledInput,
  ProgressRadial,
  Title,
} from "@itwin/itwinui-react";
import React from "react";

import "./BaseProject.scss";

export type BaseProject = {
  displayName?: string;
  projectNumber?: string;
};

export type BaseProjectProps = {
  /** Callback on canceled action. */
  onClose?: () => void;
  /** Callback on action. */
  onActionClick?: (project: {
    displayName: string;
    projectNumber: string;
  }) => void;
  /** Object of string overrides. */
  stringsOverrides?: {
    /** The title of the page. */
    titleString?: string;
    /** Project name property. */
    displayNameString?: string;
    /** Project number property. */
    projectNumberString?: string;
    /** Confirm button string. */
    confirmButton?: string;
    /** Cancel button string. */
    cancelButton?: string;
    /** Error message when name is too long. */
    displayNameTooLong?: string;
    /** Error message when number is too long. */
    projectNumberTooLong?: string;
  };
  /** If action is loading. */
  isLoading?: boolean;
  /** Initial project state used for update. */
  initialProject?: BaseProject;
};

const MAX_LENGTH = 255;

export function BaseProjectPage(props: BaseProjectProps) {
  const {
    onClose,
    onActionClick,
    initialProject,
    isLoading = false,
    stringsOverrides,
  } = props;
  const [project, setProject] = React.useState<Required<BaseProject>>({
    displayName: initialProject?.displayName ?? "",
    projectNumber: initialProject?.projectNumber ?? "",
  });

  const updatedStrings = {
    titleString: "Create a project",
    displayNameString: "Name",
    projectNumberString: "Project number",
    confirmButton: "Create",
    cancelButton: "Cancel",
    displayNameTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    projectNumberTooLong: `The value exceeds allowed ${MAX_LENGTH} characters.`,
    ...stringsOverrides,
  };

  const onPropChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setProject((prevState) => ({
      ...prevState,
      [name]: value ?? "",
    }));
  };

  const isPropertyInvalid = (value: string) => {
    return value.length > MAX_LENGTH;
  };

  const isDataValid = () => {
    return (
      !!project.displayName.length &&
      !!project.projectNumber.length &&
      !isPropertyInvalid(project.displayName) &&
      !isPropertyInvalid(project.projectNumber)
    );
  };

  const isDataChanged = () => {
    return (
      project.displayName !== initialProject?.displayName ||
      project.projectNumber !== initialProject?.projectNumber
    );
  };

  return (
    <div className="idp-project-base">
      <div>
        <Title>{updatedStrings.titleString}</Title>
        <div>
          <div className="inputs-container">
            <LabeledInput
              label={updatedStrings.displayNameString}
              inputClassName={"name-input"}
              name="displayName"
              setFocus={true}
              required={true}
              value={project.displayName}
              onChange={onPropChange}
              message={
                isPropertyInvalid(project.displayName)
                  ? updatedStrings.displayNameTooLong
                  : undefined
              }
              status={
                isPropertyInvalid(project.displayName) ? "negative" : undefined
              }
              autoComplete="off"
            />
            <LabeledInput
              label={updatedStrings.projectNumberString ?? "Project number"}
              name="projectNumber"
              inputClassName={"number-input"}
              required={true}
              value={project.projectNumber}
              onChange={onPropChange}
              message={
                isPropertyInvalid(project.projectNumber)
                  ? updatedStrings.projectNumberTooLong
                  : undefined
              }
              status={
                isPropertyInvalid(project.projectNumber)
                  ? "negative"
                  : undefined
              }
              autoComplete="off"
            />
          </div>
        </div>
      </div>
      <div className="button-bar">
        <Button
          styleType="cta"
          disabled={!isDataChanged() || !isDataValid() || isLoading}
          onClick={() =>
            onActionClick?.({
              ...project,
            })
          }
        >
          {updatedStrings.confirmButton}
        </Button>
        <Button onClick={onClose}>{updatedStrings.cancelButton}</Button>
      </div>
      {isLoading && <OverlaySpinner />}
    </div>
  );
}

function OverlaySpinner() {
  return (
    <div className="overlay-container">
      <ProgressRadial indeterminate />
    </div>
  );
}
