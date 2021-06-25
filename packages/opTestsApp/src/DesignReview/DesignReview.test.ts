/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import {
  DRChangeSetID,
  DRIModelID,
  DRProjectID,
  SiteUrl,
} from "../helpers/config";
import { DesignReview } from "../helpers/selectors";
import { page } from "../setupTest";

describe("Design Review", () => {
  it.skip("should open SportsHub", async () => {
    expect(DRProjectID).not.toEqual("Missing Project Id");
    expect(DRIModelID).not.toEqual("Missing iModel Id");
    expect(DRChangeSetID).not.toEqual("Missing Changeset Id");
    try {
      await page.goto(
        `${SiteUrl}/review/${DRProjectID}/${DRIModelID}/${DRChangeSetID}/-1/`,
        { timeout: 120000 }
      );
      const iframe = await page.waitForSelector(DesignReview.iframe);
      expect(iframe).toBeDefined();
      const openForReadRes = await page.waitForResponse((res: any) =>
        res.url().includes("openForRead")
      );
      expect(openForReadRes.status()).toEqual(200);

      const contentFrame = await iframe.contentFrame();
      const ninezone = await contentFrame?.waitForSelector(
        DesignReview.ninezone,
        {
          timeout: 120000,
        }
      );
      expect(ninezone).toBeDefined();
    } catch (error) {
      await page.screenshot({ path: "dr-did-not-open.png" });
      throw error;
    }
  });
});
