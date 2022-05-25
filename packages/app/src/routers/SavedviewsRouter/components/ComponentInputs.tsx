/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/

import { ColorDef } from "@bentley/imodeljs-common";
import { IModelApp } from "@bentley/imodeljs-frontend";
import { ColorPickerButton } from "@bentley/ui-components";
import { Slider } from "@itwin/itwinui-react";
import React, { useState } from "react";

import "./ComponentInputs.scss";
import { generateJSONInStyles } from "./GenerateJSONStyles";
import { reloadDisplayStyle } from "./ReloadDisplayStyle";

export interface ComponentsColorPickerProps {
  label: string;
  path: any[];
  pathLength: number;
  dataType?: string;
}
export function ComponentsColorPicker({
  label,
  path,
  pathLength,
  dataType,
}: ComponentsColorPickerProps) {
  return (
    <div className="label-with-color-picker">
      <h3 className="text-setting">{label}</h3>
      <ColorPickerButton
        className="color-picker-height text-setting"
        initialColor={ColorDef.fromString("skyblue")}
        onColorPick={(color: ColorDef) => {
          const newBackground = IModelApp.viewManager.selectedView?.displayStyle
            .clone()
            .toJSON();

          if (pathLength !== path.length) {
            path.pop();
          }
          if (dataType === "JSON") {
            path.push(color.toJSON());
          }
          if (dataType === "RGB") {
            path.push(color.getRgb());
          }

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          // Load display style again
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined && newBackground !== undefined) {
            reloadDisplayStyle(vp, newBackground);
          }

          console.log(JSON.stringify(newBackground, undefined, 2));
        }}
      />
    </div>
  );
}

export interface ComponentsSliderProps {
  label: string;
  path: any[];
  pathLength: number;
  min: number;
  max: number;
  step: number;
}
export function ComponentsSlider({
  label,
  path,
  pathLength,
  min,
  max,
  step,
}: ComponentsSliderProps) {
  const [value, setValue] = useState(0.2);
  return (
    <div className="label-with-slider text-setting">
      <div>
        {label} : {value.toFixed(1)}
      </div>
      <Slider
        style={{ width: "100%" }}
        thumbMode="inhibit-crossing"
        trackDisplayMode="auto"
        values={[value]}
        max={max}
        min={min}
        step={step}
        onChange={(values: ReadonlyArray<number>) => {
          const newBackground = IModelApp.viewManager.selectedView?.displayStyle
            .clone()
            .toJSON();
          setValue(values[0]);

          if (pathLength !== path.length) {
            path.pop();
          }

          path.push(values[0]);

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          // Load display style again
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined && newBackground !== undefined) {
            reloadDisplayStyle(vp, newBackground);
          }

          console.log(JSON.stringify(newBackground, undefined, 2));
        }}
      />
    </div>
  );
}

export interface ComponentsTextboxProps {
  label: string;
  path: any[];
  pathLength: number;
}
export function ComponentsTextbox({
  label,
  path,
  pathLength,
}: ComponentsTextboxProps) {
  const [inputValue, setInputValue] = useState(0);

  return (
    <div className="input-text text-setting">
      <span>
        Enter {label}: {inputValue}
      </span>
      <input
        onChange={(_event) => {
          // switch to textarea
          const newValue: number = parseInt(_event.target.value);

          const newBackground = IModelApp.viewManager.selectedView?.displayStyle
            .clone()
            .toJSON();
          if (!newValue) {
            setInputValue(0);
          } else {
            setInputValue(newValue);
          }

          if (pathLength !== path.length) {
            path.pop();
          }

          path.push(newValue);

          if (newBackground !== undefined) {
            generateJSONInStyles(newBackground, path);
          }

          // Load display style again
          const vp = IModelApp.viewManager.selectedView;
          if (vp !== undefined && newBackground !== undefined) {
            reloadDisplayStyle(vp, newBackground);
          }

          console.log(JSON.stringify(newBackground, undefined, 2));
        }}
      />
    </div>
  );
}
