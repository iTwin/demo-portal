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

import { CreateRole } from "./CreateRole";

jest.mock("isomorphic-fetch", () => jest.requireActual("node-fetch"));
const requestMock = jest.fn();
const mockedRole = { role: { id: "dd", displayName: "name" } };
const server = setupServer(
  rest.post(
    "https://api.bentley.com/projects/:projectId/roles",
    (req, res, ctx) => {
      requestMock({
        projectId: req.params["projectId"],
        body: req.body,
      });
      return res(ctx.status(200), ctx.json(mockedRole));
    }
  ),
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

describe("CreateRole", () => {
  // Enable API mocking before tests.
  beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

  // Reset any runtime request handlers we may add during the tests.
  afterEach(() => {
    jest.clearAllMocks();
    server.resetHandlers();
  });

  // Disable API mocking after the tests are done.
  afterAll(() => server.close());

  it("should create a project", async () => {
    const successMock = jest.fn();
    toaster.positive = jest.fn();

    const { getByText, container } = render(
      <CreateRole projectId="pid" accessToken="dd" onSuccess={successMock} />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, {
      target: { value: "Some name" },
    });

    const description = container.querySelector(
      "input[name=description]"
    ) as HTMLInputElement;
    fireEvent.change(description, {
      target: { value: "Some description" },
    });

    const createButton = getByText("Create");
    await act(
      () =>
        new Promise((resolve) => {
          successMock.mockImplementationOnce(resolve);
          createButton.click();
        })
    );

    expect(requestMock).toHaveBeenCalledWith({
      projectId: "pid",
      body: {
        displayName: "Some name",
        description: "Some description",
      },
    });
    expect(requestMock).toHaveBeenCalledWith({
      projectId: "pid",
      roleId: "dd",
      body: {
        displayName: "Some name",
        description: "Some description",
        permissions: [],
      },
    });
    expect(successMock).toHaveBeenCalledWith(mockedRole);
    expect(toaster.positive).toHaveBeenCalledWith(
      "Role created successfully.",
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
        message: "User is not authorized",
        code: "Unauthorized",
      },
    };
    server.use(
      rest.post(
        "https://api.bentley.com/projects/:projectId/roles",
        (req, res, ctx) => {
          requestMock({
            projectId: req.params["projectId"],
            body: req.body,
          });
          return res(ctx.status(401), ctx.json(error));
        }
      )
    );

    const { getByText, container } = render(
      <CreateRole projectId="errorPid" accessToken="dd" onError={errorMock} />
    );

    const name = container.querySelector(
      "input[name=displayName]"
    ) as HTMLInputElement;
    fireEvent.change(name, {
      target: { value: "Some name" },
    });

    const number = container.querySelector(
      "input[name=description]"
    ) as HTMLInputElement;
    fireEvent.change(number, {
      target: { value: "Some description" },
    });

    const createButton = getByText("Create");
    await act(
      () =>
        new Promise((resolve) => {
          errorMock.mockImplementationOnce(resolve);
          createButton.click();
        })
    );

    expect(requestMock).toHaveBeenCalledWith({
      projectId: "errorPid",
      body: {
        displayName: "Some name",
        description: "Some description",
      },
    });
    expect(errorMock).toHaveBeenCalledWith(error);
    expect(toaster.negative).toHaveBeenCalledWith(
      "Could not create a role. Please try again later.",
      {
        hasCloseButton: true,
      }
    );
  });
});
