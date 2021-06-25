/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { ProjectNameContainingIModel, SiteUrl } from "../helpers/config";
import { Home } from "../helpers/selectors";
import { page } from "../setupTest";

describe("Home Panel", () => {
  it("Should have right title", async () => {
    await page.goto(SiteUrl);
    await page.waitForSelector(Home.IModelSearch);
    expect(await page.title()).toBe("iModels | iTwin Hub - Bentley Systems");
  });

  it("displays project and imodel cards", async () => {
    try {
      await page.goto(`${SiteUrl}/projects`);
      await page.waitForSelector(Home.ProjectSearch);
      await page.fill(Home.ProjectSearch, ProjectNameContainingIModel);
      await page.waitForSelector(Home.Card.projectTitle);
      await page.click(Home.Card.thumbnail, { delay: 500 });
      await page.waitForSelector(Home.Card.title);
      await page.click(Home.Card.thumbnail, { delay: 500 });
      await page.waitForTimeout(1000);
      await page.goto(SiteUrl);
      await page.waitForSelector(Home.Card.title);
    } catch (error) {
      await page.screenshot({ path: "no-cards.png" });
      throw error;
    }
  });
});
