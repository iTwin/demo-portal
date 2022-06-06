/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { UpdateProject } from "./UpdateProject";

describe("UpdateProject", () => {
  const mockedProject = { project: { id: "dd", displayName: "name" } };
  const fetchMock = jest.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update a project", async () => {
    const successMock = jest.fn();
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedProject),
      } as Response)
    );
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <UpdateProject
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onSuccess={successMock}
        initialProject={{
          displayName: "Initial name",
          projectNumber: "Initial number",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some other name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.parentElement?.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/projects/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: { Authorization: "dd", Prefer: "return=representation" },
        body: JSON.stringify({
          displayName: "Some other name",
          projectNumber: "Initial number",
        }),
      }
    );
    expect(successMock).toHaveBeenCalledWith(mockedProject);
    expect(toaster.positive).toHaveBeenCalledWith(
      "Project updated successfully.",
      {
        hasCloseButton: true,
      }
    );
  });

  it("should show general error", async () => {
    const errorMock = jest.fn();
    const error = new Error("Fail");
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <UpdateProject
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        initialProject={{
          displayName: "Initial name",
          projectNumber: "Initial number",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/projects/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: { Authorization: "dd", Prefer: "return=representation" },
        body: JSON.stringify({
          displayName: "Some name",
          projectNumber: "Initial number",
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Could not update a project. Please try again later.",
      { hasCloseButton: true }
    );
  });

  it("should show project already exists error", async () => {
    const errorMock = jest.fn();
    const error = { error: { code: "ProjectExists" } };
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <UpdateProject
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        onError={errorMock}
        initialProject={{
          displayName: "Initial name",
          projectNumber: "Initial number",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const updateButton = getByText("Update");
    await act(async () => updateButton.click());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.bentley.com/projects/de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      {
        method: "PATCH",
        headers: { Authorization: "dd", Prefer: "return=representation" },
        body: JSON.stringify({
          displayName: "Some name",
          projectNumber: "Initial number",
        }),
      }
    );
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Project with the same name or number already exists.",
      { hasCloseButton: true }
    );
  });
});
