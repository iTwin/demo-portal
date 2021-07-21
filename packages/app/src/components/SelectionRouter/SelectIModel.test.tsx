/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { render } from "@testing-library/react";
import React from "react";

import SelectIModel from "./SelectIModel";

it("should have tiles with 'Delete IModel' option", () => {
  const { container, getByText } = render(
    <SelectIModel
      apiOverrides={{
        data: [
          {
            id: "iModel1",
            displayName: "MockIModel",
            thumbnail: "image.png", //required to prevent an issue with IntersectionObserver
          },
        ],
      }}
    />
  );

  //Open the more menu for the tile
  const tileMenuButton = container.querySelector(
    ".iui-more-options"
  ) as HTMLButtonElement;
  expect(tileMenuButton).toBeTruthy();
  tileMenuButton.click();

  expect(getByText("Delete iModel")).toBeTruthy();
});
