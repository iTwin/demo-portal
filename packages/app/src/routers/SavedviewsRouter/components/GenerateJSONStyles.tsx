/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/

import { ElementProps } from "@bentley/imodeljs-common";

export function generateJSONInStyles(newBackground: ElementProps, path: any[]) {
  let destination: any = newBackground.jsonProperties.styles;
  for (let i = 0; i < path.length; i++) {
    if (i === path.length - 1) {
      destination[path[i - 1]] = path[i];
      console.log("got here");
      return;
    }
    if (destination[path[i]] === undefined) {
      destination[path[i]] = {};
    }
    if (i !== path.length - 2) {
      destination = destination[path[i]];
    }
  }
}
