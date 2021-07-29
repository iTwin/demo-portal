/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  CommonStatusBarItem,
  StageUsage,
  StatusBarSection,
  UiItemsProvider,
} from "@bentley/ui-abstract";
import {
  StatusBarItemUtilities,
  useActiveViewport,
} from "@bentley/ui-framework";
import { FooterIndicator } from "@bentley/ui-ninezone";
import "@itwin/itwinui-css/css/icon.css";
import { SvgMap } from "@itwin/itwinui-icons-react";
import { Tooltip } from "@itwin/itwinui-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const BackgroundMapStatusBarItem = () => {
  const target = useRef<HTMLDivElement>(null);
  const activeViewport = useActiveViewport();
  const [bgMapOn, setBgMapOn] = useState(false);

  useEffect(() => {
    setBgMapOn(activeViewport?.viewFlags.backgroundMap ?? false);
  }, [activeViewport]);

  const onChange = useCallback(() => {
    if (activeViewport) {
      const vpFlags = activeViewport.viewFlags.clone();
      vpFlags.backgroundMap = !vpFlags.backgroundMap;
      activeViewport.viewFlags = vpFlags;
      activeViewport.synchWithView();
      setBgMapOn(vpFlags.backgroundMap);
    }
  }, [activeViewport]);

  return (
    <Tooltip
      placement="auto"
      content={bgMapOn ? "Disable background map" : "Enable background map"}
    >
      <div ref={target} onClick={onChange}>
        <FooterIndicator isInFooterMode={true}>
          <SvgMap
            style={{
              opacity: bgMapOn ? 1 : 0.5,
              cursor: "pointer",
            }}
            className="iui-icons-default"
          />
        </FooterIndicator>
      </div>
    </Tooltip>
  );
};

export class BackgroundMapsProvider implements UiItemsProvider {
  public readonly id = "BackgroundMapsProvider";

  public provideStatusBarItems(
    _stageId: string,
    stageUsage: string
  ): CommonStatusBarItem[] {
    const statusBarItems: CommonStatusBarItem[] = [];
    if (stageUsage === StageUsage.General) {
      statusBarItems.push(
        StatusBarItemUtilities.createStatusBarItem(
          "BackgroundMaps.StatusBarItem",
          StatusBarSection.Right,
          10,
          <BackgroundMapStatusBarItem />
        )
      );
    }

    return statusBarItems;
  }
}
