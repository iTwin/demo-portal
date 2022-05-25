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

import { ColorOptionsPanel } from "../components/ColorOptionComponents";

export class ColorUiProvider implements UiItemsProvider {
  public readonly id = "ColorUiProviderId";
  public static toggledOnce = false;
  public static originalBackground: any;
  public static backgroundSkyToggleFlag = false;
  public static backgroundGroundToggleFlag = false;

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
      const ColorWidget: AbstractWidgetProps = {
        id: "ColorWidget",
        label: "Color Settings",
        getWidgetContent() {
          return <ColorOptionsPanel />;
        },
      };
      widgets.push(ColorWidget);
    }
    return widgets;
  }
}
