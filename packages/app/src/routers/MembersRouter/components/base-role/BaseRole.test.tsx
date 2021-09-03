/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { BaseRolePage } from "./BaseRole";

describe("BaseRole", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show base page", () => {
    const actionMock = jest.fn();
    const closeMock = jest.fn();

    const { container, getByText } = render(
      <BaseRolePage onActionClick={actionMock} onClose={closeMock} />
    );

    getByText("Create a role");

    expect(
      container.querySelector(".idp-role-base .inputs-container .name-input")
    ).toBeTruthy();
    expect(
      container.querySelector(
        ".idp-role-base .inputs-container .description-input"
      )
    ).toBeTruthy();

    const confirmButton = container.querySelector(
      ".idp-role-base .button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toBe("Create");
    confirmButton.click();
    expect(actionMock).not.toHaveBeenCalled();
    const cancelButton = container.querySelector(
      ".idp-role-base .button-bar button:last-child"
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(closeMock).toHaveBeenCalled();
  });

  it("should show overlay spinner", () => {
    const { container } = render(<BaseRolePage isLoading />);

    expect(
      container.querySelector(".idp-role-base .overlay-container")
    ).toBeTruthy();
  });

  it("should show error message for too long string", async () => {
    const { container, getByText } = render(<BaseRolePage />);

    const name = container.querySelector(
      ".idp-role-base .inputs-container .name-input"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: new Array(260).join("a") } });
    getByText("The value exceeds allowed 255 characters.");
    const confirmButton = container.querySelector(
      ".idp-role-base .button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
  });

  it("should show base page with filled values", () => {
    const { container } = render(
      <BaseRolePage
        initialRole={{
          displayName: "Some name",
          description: "Some description",
        }}
      />
    );

    const name = container.querySelector(
      ".idp-role-base .inputs-container .name-input"
    ) as HTMLInputElement;
    expect(name).toBeTruthy();
    expect(name.value).toBe("Some name");

    const description = container.querySelector(
      ".idp-role-base .inputs-container .description-input"
    ) as HTMLInputElement;
    expect(description).toBeTruthy();
    expect(description.value).toBe("Some description");
  });
});
