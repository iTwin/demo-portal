/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { v4 as uuidv4 } from "uuid";

import { SiteUrl } from "../helpers/config";
import { page } from "../setupTest";

describe("Project Creation", () => {
  describe("Navigation", () => {
    it("Should be able to navigate to project creation", async () => {
      await page.goto(SiteUrl);
      await page.click('text="Register a project"');
      expect(page.url()).toEqual(`${SiteUrl}/createProject/`);
    });

    it("Should navigate back to home page if hit cancel", async () => {
      await page.goto(`${SiteUrl}/createProject/`);
      await page.click('text="Register a project"');
      await page.click('button[data-testid="project-create-cancel"]');
      expect(page.url()).toEqual(`${SiteUrl}/`);
    });
  });

  // need to get priveleges for test user to create projects in QA
  it.skip("Should create a new Project", async () => {
    await page.goto(`${SiteUrl}/createProject`);
    const guid = uuidv4();
    await page.fill('input[data-testid="project-name-input"]', `E2E_${guid}`);
    await page.fill('input[data-testid="project-number-input"]', `E2E_${guid}`);

    const [response] = await Promise.all([
      page.waitForResponse(
        "**/Repositories/BentleyCONNECT--Main/ConnectedContext/Project"
      ),
      page.click('button[data-testid="project-create"]'),
    ]);

    const responseObj = (await response?.json()) as any;
    expect(responseObj).toBeDefined();
    const projectId =
      responseObj.changedInstance.instanceAfterChange.instanceId;

    expect(page.url()).toEqual(`${SiteUrl}/project/${projectId}/`);
  });
});
