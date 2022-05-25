/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import {
  AbstractWidgetProps,
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import React from "react";

import { LightsOptionsPanel } from "../components/LightsOptionComponents";

export class ChangeLightsUiProvider implements UiItemsProvider {
  public readonly id = "ChangeLightsUiProviderId";
  public provideWidgets(
    stageId: string,
    stageUsage: string,
    location: StagePanelLocation,
    section?: StagePanelSection
  ): ReadonlyArray<AbstractWidgetProps> {
    const widgets: AbstractWidgetProps[] = [];
    if (
      location === StagePanelLocation.Right &&
      section === StagePanelSection.Start
    ) {
      const backgroundColorWidget: AbstractWidgetProps = {
        id: "LightsWidget",
        label: "Lights settings",
        getWidgetContent() {
          return <LightsOptionsPanel></LightsOptionsPanel>;
        },
      };
      widgets.push(backgroundColorWidget);
    }
    return widgets;
  }
}
