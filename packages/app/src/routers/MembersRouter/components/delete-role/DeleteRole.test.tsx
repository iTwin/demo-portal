/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { act, render } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { DeleteRole } from "./DeleteRole";

jest.mock("isomorphic-fetch", () => jest.requireActual("node-fetch"));
const requestMock = jest.fn();
const server = setupServer(
  rest.delete(
    "https://api.bentley.com/projects/:projectId/roles/:roleId",
    (req, res, ctx) => {
      requestMock();
      return res(ctx.status(200));
    }
  )
);

describe("DeleteProject", () => {
  // Enable API mocking before tests.
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => {
    requestMock.mockClear();
    server.resetHandlers();
  });

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  it("should open delete modal", () => {
    const { getByText } = render(
      <DeleteRole
        role={{
          id: "111",
          displayName: "test role",
          projectId: "222",
        }}
        accessToken="dd"
      />
    );

    const title = document.querySelector(
      ".idp-delete-role-title"
    ) as HTMLElement;
    expect(title.textContent).toBe(`Delete role 'test role'`);
    expect(
      title.querySelector(".idp-delete-role-title .warning-icon")
    ).toBeTruthy();
    getByText(
      "Deleting this role will remove it for all users. Are you sure you want to delete this role?"
    );
  });

  it("should delete role", async () => {
    const successMock = jest.fn();

    const { getByText } = render(
      <DeleteRole
        role={{
          id: "111",
          displayName: "test project",
          projectId: "222",
        }}
        accessToken="dd"
        onSuccess={successMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(
      () =>
        new Promise<void>((resolve) => {
          successMock.mockImplementationOnce(resolve);
          button.click();
        })
    );
    expect(requestMock).toHaveBeenCalled();
    expect(successMock).toHaveBeenCalled();
  });

  it("should return error when failed to delete role", async () => {
    const failureMock = jest.fn();
    const error = { message: "Error", code: "500" };
    server.use(
      rest.delete(
        "https://api.bentley.com/projects/:projectId/roles/:roleId",
        (req, res, ctx) => {
          requestMock();
          return res(ctx.status(500), ctx.json(error));
        }
      )
    );
    const { getByText } = render(
      <DeleteRole
        role={{
          id: "111",
          displayName: "test project",
          projectId: "222",
        }}
        accessToken="dd"
        onError={failureMock}
      />
    );

    const button = getByText("Yes") as HTMLButtonElement;
    await act(
      () =>
        new Promise<void>((resolve) => {
          failureMock.mockImplementationOnce(resolve);
          button.click();
        })
    );
    expect(requestMock).toHaveBeenCalled();
    expect(failureMock).toHaveBeenCalledWith(error);
  });

  it("should close dialog", () => {
    const closeMock = jest.fn();

    const { getByText } = render(
      <DeleteRole
        role={{
          id: "111",
          displayName: "test project",
          projectId: "222",
        }}
        accessToken="dd"
        onClose={closeMock}
      />
    );

    const button = getByText("No") as HTMLButtonElement;
    act(() => button.click());
    expect(requestMock).not.toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
