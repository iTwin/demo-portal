/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { CreateProject } from "./CreateProject";

describe("CreateProject", () => {
  const mockedProject = { project: { id: "dd", displayName: "name" } };
  const fetchMock = jest.fn();
  global.fetch = fetchMock;

  beforeEach(() => {
    fetchMock.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a project", async () => {
    const successMock = jest.fn();
    fetchMock.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockedProject),
      } as Response)
    );
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <CreateProject accessToken="dd" onSuccess={successMock} />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const number = container.querySelector(
      "input[name=projectNumber]"
    ) as HTMLInputElement;
    fireEvent.change(number, { target: { value: "Some number" } });

    const createButton = getByText("Create");
    await act(async () => createButton.parentElement?.click());
    expect(fetchMock).toHaveBeenCalledWith("https://api.bentley.com/projects", {
      method: "POST",
      headers: { Authorization: "dd", Prefer: "return=representation" },
      body: JSON.stringify({
        displayName: "Some name",
        projectNumber: "Some number",
      }),
    });
    expect(successMock).toHaveBeenCalledWith(mockedProject);
    expect(toaster.positive).toHaveBeenCalledWith(
      "Project created successfully.",
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
      <CreateProject accessToken="dd" onError={errorMock} />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const number = container.querySelector(
      "input[name=projectNumber]"
    ) as HTMLInputElement;
    fireEvent.change(number, { target: { value: "Some number" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith("https://api.bentley.com/projects", {
      method: "POST",
      headers: { Authorization: "dd", Prefer: "return=representation" },
      body: JSON.stringify({
        displayName: "Some name",
        projectNumber: "Some number",
      }),
    });
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Could not create a project. Please try again later.",
      { hasCloseButton: true }
    );
  });

  it("should show project already exists error", async () => {
    const errorMock = jest.fn();
    const error = { error: { code: "ProjectExists" } };
    fetchMock.mockImplementationOnce(() => Promise.reject(error));
    toaster.negative = jest.fn();

    const { getByText, container } = render(
      <CreateProject accessToken="dd" onError={errorMock} />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, { target: { value: "Some name" } });

    const number = container.querySelector(
      "input[name=projectNumber]"
    ) as HTMLInputElement;
    fireEvent.change(number, { target: { value: "Some number" } });

    const createButton = getByText("Create");
    await act(async () => createButton.click());
    expect(fetchMock).toHaveBeenCalledWith("https://api.bentley.com/projects", {
      method: "POST",
      headers: { Authorization: "dd", Prefer: "return=representation" },
      body: JSON.stringify({
        displayName: "Some name",
        projectNumber: "Some number",
      }),
    });
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(
      toaster.negative
    ).toHaveBeenCalledWith(
      "Project with the same name or number already exists.",
      { hasCloseButton: true }
    );
  });
});
