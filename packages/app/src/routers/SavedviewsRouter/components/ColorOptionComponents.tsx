/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/

// tslint:disable:@typescript-eslint/no-empty-function
import { ColorDef } from "@bentley/imodeljs-common";
import {
  DisplayStyle3dState,
  EmphasizeElements,
  IModelApp,
} from "@bentley/imodeljs-frontend";
import { ColorPickerButton } from "@bentley/ui-components";
import { Button, ExpandableBlock, ToggleSwitch } from "@itwin/itwinui-react";
import React, { useState } from "react";

import { ComponentsColorPicker } from "./ComponentInputs";
import "./ComponentInputs.scss";
import { generateJSONInStyles } from "./GenerateJSONStyles";
let SelectedElementColor = ColorDef.fromString("skyblue");

export interface EnvironmentDisplayToggleProps {
  label: string;
  environmentType: string;
  path: any[];
  pathLength: number;
}
function getEnvironmentDisplay(environmentType: string): boolean {
  const newBackground = IModelApp.viewManager.selectedView?.displayStyle.toJSON();
  return (
    newBackground?.jsonProperties?.styles?.environment?.[environmentType]
      ?.display ?? false
  );
}
export function EnvironmentDisplayToggle({
  label,
  environmentType,
  path,
  pathLength,
}: EnvironmentDisplayToggleProps) {
  const [toggleValue, setToggleValue] = useState<boolean>(
    getEnvironmentDisplay(environmentType)
  );

  return (
    <ToggleSwitch
      className="text-setting"
      label={label}
      checked={toggleValue}
      onChange={() => {
        const newBackground = IModelApp.viewManager.selectedView?.displayStyle
          .clone()
          .toJSON();

        if (pathLength !== path.length) {
          path.pop();
        }

        path.push(!toggleValue);

        if (newBackground !== undefined) {
          generateJSONInStyles(newBackground, path);
        }

        const vp = IModelApp.viewManager.selectedView;

        if (vp !== undefined && newBackground !== undefined) {
          const state = new DisplayStyle3dState(newBackground, vp.iModel);
          state
            .load()
            .then(() => {
              vp.view.setDisplayStyle(state);
            })
            .catch((ex) => {
              console.log(`Error found: ${ex}`);
            });
        }

        setToggleValue(!toggleValue);
      }}
    />
  );
}

export interface SelectedElementColorPickerProps {
  label: string;
}
export function SelectedElementColorPicker({
  label,
}: SelectedElementColorPickerProps) {
  return (
    <div className="label-with-color-picker">
      <h3 className="text-setting">{label}</h3>
      <ColorPickerButton
        initialColor={ColorDef.fromString("skyblue")}
        onColorPick={(color: ColorDef) => {
          SelectedElementColor = color;
        }}
      />
    </div>
  );
}

export interface SelectedElementColorButtonProps {
  label: string;
  action: string;
}
export function SelectedElementColorButton({
  label,
  action,
}: SelectedElementColorButtonProps) {
  return (
    <div className="button-container text-setting">
      <Button
        className="button-label"
        onClick={() => {
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined) {
            const ee = EmphasizeElements.getOrCreate(vp);
            ee.wantEmphasis = true;
            if (action === "clear") {
              EmphasizeElements.clear(vp);
            } else if (action === "apply") {
              ee.overrideSelectedElements(vp, SelectedElementColor);
            }
          }
        }}
      >
        {label}
      </Button>
    </div>
  );
}

export function ColorOptionsPanel() {
  const skyColorTogglePath = ["environment", "sky", "display"];
  const skyGroundColorPath = ["environment", "sky", "groundColor"];
  const skyNadirColorPath = ["environment", "sky", "nadirColor"];
  const skyskyColorPath = ["environment", "sky", "skyColor"];
  const skyZenithColorPath = ["environment", "sky", "zenithColor"];
  const groundColorTogglePath = ["environment", "ground", "display"];
  const groundAboveColorPath = ["environment", "ground", "aboveColor"];
  const groundBelowColorPath = ["environment", "ground", "belowColor"];

  return (
    <div>
      <ExpandableBlock title="Change Sky Background Color">
        <EnvironmentDisplayToggle
          label="Change Sky Background Color"
          environmentType="sky"
          path={skyColorTogglePath}
          pathLength={skyColorTogglePath.length}
        />
        <ComponentsColorPicker
          label="Ground Color"
          path={skyGroundColorPath}
          pathLength={skyGroundColorPath.length}
          dataType={"JSON"}
        />
        <ComponentsColorPicker
          label="Nadir Color"
          path={skyNadirColorPath}
          pathLength={skyNadirColorPath.length}
          dataType={"JSON"}
        />
        <ComponentsColorPicker
          label="Sky Color"
          path={skyskyColorPath}
          pathLength={skyskyColorPath.length}
          dataType={"JSON"}
        />
        <ComponentsColorPicker
          label="Zenith Color"
          path={skyZenithColorPath}
          pathLength={skyZenithColorPath.length}
          dataType={"JSON"}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Change Ground Background Color">
        <EnvironmentDisplayToggle
          label="Change Ground Background Color"
          environmentType="ground"
          path={groundColorTogglePath}
          pathLength={groundColorTogglePath.length}
        />
        <ComponentsColorPicker
          label="Above Color"
          path={groundAboveColorPath}
          pathLength={groundAboveColorPath.length}
          dataType={"JSON"}
        />
        <ComponentsColorPicker
          label="Below Color"
          path={groundBelowColorPath}
          pathLength={groundBelowColorPath.length}
          dataType={"JSON"}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Selected Element Color">
        <SelectedElementColorPicker label="Selected Color" />
        <div className="two-object-container-row">
          <SelectedElementColorButton label="Apply Color" action="apply" />
          <SelectedElementColorButton label="Reset Color" action="clear" />
        </div>
      </ExpandableBlock>
    </div>
  );
}
