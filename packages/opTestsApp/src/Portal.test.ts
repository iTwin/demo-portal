/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { SiteUrl, UnauthorizedUser } from "./helpers/config";
import { Error, Home, Viewer } from "./helpers/selectors";
import { login, page } from "./setupTest";

describe("Portal", () => {
  it("Should have right title", async () => {
    await page.goto(SiteUrl);
    await page.waitForSelector(Home.icon);
    expect(await page.title()).toBe("iTwin Demo Portal");
  });

  it("displays project and imodel cards and renders the viewer when the imodel card is clicked", async () => {
    try {
      await page.goto(`${SiteUrl}/view`);
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

  it("should block unauthorized users", async () => {
    try {
      await page.close(); // close the existing page where the Authorized User is logged in
      await login(UnauthorizedUser, Error.Unauthorized); // login with an unauthorized user
      const errorComp = await page.waitForSelector(Error.Component);
      expect(errorComp).toBeDefined();
    } catch (error) {
      await page.screenshot({ path: "unauthorized.png" });
      throw error;
    }
  });
});
