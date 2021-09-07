/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { toaster } from "@itwin/itwinui-react";
import { act, fireEvent, render } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";

import { UpdateRole } from "./UpdateRole";

jest.mock("isomorphic-fetch", () => jest.requireActual("node-fetch"));
const requestMock = jest.fn();
const mockedRole = { role: { id: "dd", displayName: "name" } };
const server = setupServer(
  rest.patch(
    "https://api.bentley.com/projects/:projectId/roles/:roleId",
    (req, res, ctx) => {
      requestMock({
        projectId: req.params["projectId"],
        roleId: req.params["roleId"],
        body: req.body,
      });
      return res(ctx.status(200), ctx.json(mockedRole));
    }
  )
);

describe("UpdateRole", () => {
  // Enable API mocking before tests.
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  it("should update a role", async () => {
    const successMock = jest.fn();
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <UpdateRole
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        roleId="de611094-d9b9-4355-ba36-f86a5b08d4ff"
        onSuccess={successMock}
        initialRole={{
          displayName: "Initial name",
          description: "Initial description",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, {
      target: { value: "Some other name" },
    });

    const updateButton = getByText("Update");
    await act(
      () =>
        new Promise((resolve) => {
          successMock.mockImplementationOnce(resolve);
          updateButton.click();
        })
    );
    expect(requestMock).toHaveBeenCalledWith({
      projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      roleId: "de611094-d9b9-4355-ba36-f86a5b08d4ff",
      body: {
        displayName: "Some other name",
        description: "Initial description",
        permissions: [],
      },
    });
    expect(successMock).toHaveBeenCalledWith(mockedRole);
    expect(toaster.positive).toHaveBeenCalledWith(
      "Role updated successfully.",
      {
        hasCloseButton: true,
      }
    );
  });

  it("should show general error", async () => {
    const errorMock = jest.fn();
    toaster.negative = jest.fn();
    const error = {
      error: {
        message: "Unauthorized",
        code: "401",
      },
    };
    server.use(
      rest.patch(
        "https://api.bentley.com/projects/:projectId/roles/:roleId",
        (req, res, ctx) => {
          requestMock({
            projectId: req.params["projectId"],
            roleId: req.params["roleId"],
            body: req.body,
          });
          return res(ctx.status(401), ctx.json(error));
        }
      )
    );

    const { getByText, container } = render(
      <UpdateRole
        accessToken="dd"
        projectId="de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b"
        roleId="de611094-d9b9-4355-ba36-f86a5b08d4ff"
        onError={errorMock}
        initialRole={{
          displayName: "Initial name",
          description: "Initial description",
        }}
      />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, {
      target: { value: "Some name" },
    });

    const updateButton = getByText("Update");
    await act(
      () =>
        new Promise((resolve) => {
          errorMock.mockImplementationOnce(resolve);
          updateButton.click();
        })
    );

    expect(requestMock).toHaveBeenCalledWith({
      projectId: "de47c5ad-5657-42b8-a2bc-f2b8bf84cd4b",
      roleId: "de611094-d9b9-4355-ba36-f86a5b08d4ff",

      body: {
        displayName: "Some name",
        description: "Initial description",
        permissions: [],
      },
    });
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(toaster.negative).toHaveBeenCalledWith(
      "Could not update a role. Please try again later.",
      {
        hasCloseButton: true,
      }
    );
  });
});
