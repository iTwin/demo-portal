/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import { render } from "@testing-library/react";
import React from "react";

import SelectIModel from "./SelectIModel";

it("should have tiles with 'View' option", () => {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })),
  });

  const { container, getByText } = render(
    <LocationProvider history={createHistory(createMemorySource("/"))}>
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
    </LocationProvider>
  );

  //Open the more menu for the tile
  const tileMenuButton = container.querySelector(
    ".iui-more-options"
  ) as HTMLButtonElement;
  expect(tileMenuButton).toBeTruthy();
  tileMenuButton.click();

  expect(getByText("View")).toBeTruthy();
});
