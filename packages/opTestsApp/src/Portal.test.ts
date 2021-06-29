/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { SiteUrl } from "./helpers/config";
import { Home, Viewer } from "./helpers/selectors";
import { page } from "./setupTest";

describe("Portal", () => {
  it("Should have right title", async () => {
    await page.goto(SiteUrl);
    await page.waitForSelector(Home.icon);
    expect(await page.title()).toBe("iTwin Demo Portal");
  });

  it("displays project and imodel cards and renders the viewer when the imodel card is clicked", async () => {
    try {
      await page.goto(`${SiteUrl}/view?myprojects`);
      await page.waitForSelector(Home.Card.grid);
      await page.waitForSelector(Home.Card.title);
      await page.click(Home.Card.thumbnail, { delay: 1000 });
      await page.waitForSelector(Home.Card.grid);
      await page.waitForSelector(Home.Card.title);
      await page.click(Home.Card.thumbnail, { delay: 1000 });
      const viewer = await page.waitForSelector(Viewer.container);
      expect(viewer).toBeDefined();
    } catch (error) {
      await page.screenshot({ path: "no-cards.png" });
      throw error;
    }
  });
});
