/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/

import { ElementProps } from "@bentley/imodeljs-common";
import {
  DisplayStyle3dState,
  ScreenViewport,
} from "@bentley/imodeljs-frontend";

export function reloadDisplayStyle(
  vp: ScreenViewport,
  newBackground: ElementProps
) {
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
}
