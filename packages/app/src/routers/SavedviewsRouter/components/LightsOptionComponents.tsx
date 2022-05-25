/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { IModelApp } from "@bentley/imodeljs-frontend";
import { ExpandableBlock, ToggleSwitch } from "@itwin/itwinui-react";
import React, { useState } from "react";

import {
  ComponentsColorPicker,
  ComponentsSlider,
  ComponentsTextbox,
} from "./ComponentInputs";
import "./ComponentInputs.scss";
import { generateJSONInStyles } from "./GenerateJSONStyles";
import { reloadDisplayStyle } from "./ReloadDisplayStyle";

export interface SolarAlwaysEnabledToggleProps {
  label: string;
}
function getSolarAlwaysEnabled(): boolean {
  const newBackground = IModelApp.viewManager.selectedView?.displayStyle.toJSON();
  return (
    newBackground?.jsonProperties?.styles?.lights?.solar?.alwaysEnable ?? false
  );
}
export function SolarAlwaysEnabledToggle({
  label,
}: SolarAlwaysEnabledToggleProps) {
  const [toggleValue, setToggleValue] = useState<boolean>(
    getSolarAlwaysEnabled()
  );

  return (
    <ToggleSwitch
      className="label-with-toggle"
      label={label}
      checked={toggleValue}
      onChange={() => {
        const newBackground = IModelApp.viewManager.selectedView?.displayStyle
          .clone()
          .toJSON();
        const path = ["lights", "solar", "alwaysEnabled", !toggleValue];

        if (newBackground !== undefined) {
          generateJSONInStyles(newBackground, path);
        }

        // Load display style again
        const vp = IModelApp.viewManager.selectedView;
        if (vp !== undefined && newBackground !== undefined) {
          reloadDisplayStyle(vp, newBackground);
        }

        setToggleValue(!toggleValue);
        console.log(JSON.stringify(newBackground, undefined, 2));
      }}
    />
  );
}

export function LightsOptionsPanel() {
  const shadowColorPath = ["solarShadows", "color"];
  const ambientLightColorpath = ["lights", "ambient", "color"];
  const hemisphereLowerLightsColor = ["lights", "hemisphere", "lowerColor"];
  const hemisphereUpperLightsColor = ["lights", "hemisphere", "upperColor"];
  const ambientIntensityPath = ["lights", "ambient", "intensity"];
  const hemisphereIntensityPath = ["lights", "hemisphere", "intensity"];
  const numCelsPath = ["lights", "numCels"];
  const portraitPath = ["lights", "portrait", "intensity"];
  const solarIntendityPath = ["lights", "solar", "intensity"];
  const solarDirectionXPath = ["lights", "solar", "direction", "x"];
  const solarDirectionYPath = ["lights", "solar", "direction", "y"];
  const solarDirectionZPath = ["lights", "solar", "direction", "z"];
  const solarTimePointPath = ["lights", "solar", "timepoint"];
  const specularIntensityPath = ["lights", "specularIntensity"];

  return (
    <div>
      <ExpandableBlock title="Solar Shadow">
        <ComponentsColorPicker
          label="Shadow Color"
          path={shadowColorPath}
          pathLength={shadowColorPath.length}
          dataType="JSON"
        />
      </ExpandableBlock>

      <ExpandableBlock title="Ambient Light">
        <ComponentsColorPicker
          label="Ambient Light Color"
          path={ambientLightColorpath}
          pathLength={ambientLightColorpath.length}
          dataType="JSON"
        />
        <ComponentsSlider
          label="Ambient Intensity Color"
          path={ambientIntensityPath}
          pathLength={ambientIntensityPath.length}
          max={5}
          min={0}
          step={0.1}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Hemisphere Lights">
        <ComponentsColorPicker
          label="Lower Color"
          path={hemisphereLowerLightsColor}
          pathLength={3}
          dataType="JSON"
        />
        <ComponentsColorPicker
          label="Upper Color"
          path={hemisphereUpperLightsColor}
          pathLength={3}
          dataType="JSON"
        />
        <ComponentsSlider
          label="Intensity"
          path={hemisphereIntensityPath}
          pathLength={hemisphereIntensityPath.length}
          max={1}
          min={0}
          step={0.1}
        />
      </ExpandableBlock>

      <ExpandableBlock title="NumCels">
        <ComponentsSlider
          label="NumCels Value"
          path={numCelsPath}
          pathLength={numCelsPath.length}
          max={254}
          min={0}
          step={1}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Portrait">
        <ComponentsSlider
          label="Portrait Value"
          path={portraitPath}
          pathLength={portraitPath.length}
          max={5}
          min={0}
          step={0.1}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Solar Light">
        <ComponentsTextbox
          label="X-coordinate"
          path={solarDirectionXPath}
          pathLength={solarDirectionXPath.length}
        />
        <ComponentsTextbox
          label="Y-coordinate"
          path={solarDirectionYPath}
          pathLength={solarDirectionYPath.length}
        />
        <ComponentsTextbox
          label="Z-coordinate"
          path={solarDirectionZPath}
          pathLength={solarDirectionZPath.length}
        />
        <ComponentsSlider
          label="Intensity"
          path={solarIntendityPath}
          pathLength={solarIntendityPath.length}
          max={5}
          min={0}
          step={0.1}
        />
        <ComponentsTextbox
          label="Time Point"
          path={solarTimePointPath}
          pathLength={solarTimePointPath.length}
        />
      </ExpandableBlock>

      <ExpandableBlock title="Specular Intensity">
        <ComponentsSlider
          label="Intensity Value"
          path={specularIntensityPath}
          pathLength={specularIntensityPath.length}
          max={5}
          min={0}
          step={0.1}
        />
      </ExpandableBlock>
    </div>
  );
}
