/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { prefixUrl } from "../useApiPrefix";
import {
  BASE_PATH,
  GroupCreateSavedviewsAPI,
  GroupsApi,
  GroupUpdateSavedviewsAPI,
  ImagesApi,
  SavedViewCreateSavedviewsAPI,
  SavedViewsApi,
  SavedViewUpdateSavedviewsAPI,
  TagCreateSavedviewsAPI,
  TagsApi,
  TagUpdateSavedviewsAPI,
} from "./generated";

export const GroupIdHrefMatcher = /[^/]*$/;

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";
export class SavedviewsClient {
  private groupsApi: GroupsApi;
  private tagsApi: TagsApi;
  private savedviewsApi: SavedViewsApi;
  private imageApi: ImagesApi;
  constructor(urlPrefix: string, private accessToken: string) {
    const baseUrl = prefixUrl(BASE_PATH, urlPrefix);
    this.groupsApi = new GroupsApi(undefined, baseUrl);
    this.tagsApi = new TagsApi(undefined, baseUrl);
    this.savedviewsApi = new SavedViewsApi(undefined, baseUrl);
    this.imageApi = new ImagesApi(undefined, baseUrl);
  }

  async createGroup(group: GroupCreateSavedviewsAPI) {
    return this.groupsApi.createGroup(this.accessToken, group, ACCEPT);
  }

  async getGroup(groupId: string) {
    return this.groupsApi.getGroup(groupId, this.accessToken, ACCEPT);
  }

  async updateGroup(groupId: string, payload: GroupUpdateSavedviewsAPI) {
    return this.groupsApi.updateGroup(
      groupId,
      this.accessToken,
      payload,
      ACCEPT
    );
  }

  async getAllGroups(projectId: string, iModelId?: string) {
    return this.groupsApi.getAllGroups(
      projectId,
      this.accessToken,
      iModelId,
      ACCEPT
    );
  }

  async deleteGroup(groupId: string) {
    return this.groupsApi.deleteGroup(groupId, this.accessToken, ACCEPT);
  }

  async createSavedview(payload: SavedViewCreateSavedviewsAPI) {
    return this.savedviewsApi.createSavedview(
      this.accessToken,
      payload,
      ACCEPT
    );
  }

  async getSavedview(id: string) {
    return this.savedviewsApi.getSavedview(id, this.accessToken, ACCEPT);
  }

  async updateSavedview(id: string, payload: SavedViewUpdateSavedviewsAPI) {
    return this.savedviewsApi.updateSavedview(
      id,
      this.accessToken,
      payload,
      ACCEPT
    );
  }

  async getAllGroupSavedviews(id: string, top = 100, skip = 0) {
    return this.savedviewsApi.getAllSavedviews(
      this.accessToken,
      undefined,
      undefined,
      id,
      top,
      skip,
      ACCEPT
    );
  }

  async getAllSavedviews(
    projectId: string,
    iModelId?: string,
    top = 100,
    skip = 0
  ) {
    return this.savedviewsApi.getAllSavedviews(
      this.accessToken,
      projectId,
      iModelId,
      undefined,
      top,
      skip,
      ACCEPT
    );
  }

  async deleteSavedview(id: string) {
    return this.savedviewsApi.deleteSavedview(id, this.accessToken, ACCEPT);
  }

  async createTag(tag: TagCreateSavedviewsAPI) {
    return this.tagsApi.createTag(this.accessToken, tag, ACCEPT);
  }

  async getTag(tagId: string) {
    return this.tagsApi.getTag(tagId, this.accessToken, ACCEPT);
  }

  async updateTag(tagId: string, payload: TagUpdateSavedviewsAPI) {
    return this.tagsApi.updateTag(tagId, this.accessToken, payload, ACCEPT);
  }

  async getAllTags(projectId: string, iModelId?: string) {
    return this.tagsApi.getAllTags(
      projectId,
      this.accessToken,
      iModelId,
      ACCEPT
    );
  }

  async deleteTag(tagId: string) {
    return this.tagsApi.deleteTag(tagId, this.accessToken, ACCEPT);
  }
}
