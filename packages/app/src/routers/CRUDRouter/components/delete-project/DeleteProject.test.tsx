/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { act, render } from "@testing-library/react";
import React from "react";

import { DeleteProject } from "./DeleteProject";

describe("DeleteProject", () => {
  const fetchMock = jest.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  it("should open delete modal", () => {
    const { getByText } = render(
      <DeleteProject
        project={{ id: "111", displayName: "test project" }}
        accessToken="dd"
      />
    );

    const title = document.querySelector(".idp-delete-title") as HTMLElement;
    expect(title.textContent).toBe(`Delete project 'test project'`);
    expect(title.querySelector(".idp-delete-title .warning-icon")).toBeTruthy();
    getByText(
      "Deleting this project will remove access for all users and all data will no longer be available. Are you sure you want to delete this project?"
    );
  });

  it("should delete project", async () => {
    const successMock = jest.fn();
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({ ok: true } as Response)
    );

    const { getByText } = render(
      <DeleteProject
        project={{ id: "111", displayName: "test project" }}
        accessToken="dd"
        onSuccess={successMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(async () => button.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/projects/111",
      {
        method: "DELETE",
        headers: { Authorization: "dd" },
      }
    );
    expect(successMock).toHaveBeenCalled();
  });

  it("should return error when failed to delete project", async () => {
    const failureMock = jest.fn();
    const error = new Error("Fail");
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    const { getByText } = render(
      <DeleteProject
        project={{ id: "111", displayName: "test project" }}
        accessToken="dd"
        onError={failureMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(async () => button.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/projects/111",
      {
        method: "DELETE",
        headers: { Authorization: "dd" },
      }
    );
    expect(failureMock).toHaveBeenCalledWith(error);
  });

  it("should close dialog", () => {
    const closeMock = jest.fn();

    const { getByText } = render(
      <DeleteProject
        project={{ id: "111", displayName: "test project" }}
        accessToken="dd"
        onClose={closeMock}
      />
    );

    const button = getByText("No") as HTMLButtonElement;
    act(() => button.click());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
