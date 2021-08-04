/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { fireEvent, render } from "@testing-library/react";
import React from "react";

import { BaseProjectPage } from "./BaseProject";

describe("BaseProject", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should show base page", () => {
    const actionMock = jest.fn();
    const closeMock = jest.fn();

    const { container, getByText } = render(
      <BaseProjectPage onActionClick={actionMock} onClose={closeMock} />
    );

    getByText("Create a project");

    expect(
      container.querySelector(".idp-project-base .inputs-container .name-input")
    ).toBeTruthy();
    expect(
      container.querySelector(
        ".idp-project-base .inputs-container .number-input"
      )
    ).toBeTruthy();

    const confirmButton = container.querySelector(
      ".idp-project-base .button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toBe("Create");
    confirmButton.click();
    expect(actionMock).not.toHaveBeenCalled();
    const cancelButton = container.querySelector(
      ".idp-project-base .button-bar button:last-child"
    ) as HTMLButtonElement;
    cancelButton.click();
    expect(closeMock).toHaveBeenCalled();
  });

  it("should show overlay spinner", () => {
    const { container } = render(<BaseProjectPage isLoading />);

    expect(
      container.querySelector(".idp-project-base .overlay-container")
    ).toBeTruthy();
  });

  it("should show error message for too long string", async () => {
    const { container, getByText } = render(<BaseProjectPage />);

    const name = container.querySelector(
      ".idp-project-base .inputs-container .name-input"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: new Array(260).join("a") } });
    getByText("The value exceeds allowed 255 characters.");
    const confirmButton = container.querySelector(
      ".idp-project-base .button-bar button:first-child"
    ) as HTMLButtonElement;
    expect(confirmButton.disabled).toBe(true);
  });

  it("should show base page with filled values", () => {
    const { container } = render(
      <BaseProjectPage
        initialProject={{
          displayName: "Some name",
          projectNumber: "Some description",
        }}
      />
    );

    const name = container.querySelector(
      ".idp-project-base .inputs-container .name-input"
    ) as HTMLInputElement;
    expect(name).toBeTruthy();
    expect(name.value).toBe("Some name");

    const description = container.querySelector(
      ".idp-project-base .inputs-container .number-input"
    ) as HTMLInputElement;
    expect(description).toBeTruthy();
    expect(description.value).toBe("Some description");
  });
});
