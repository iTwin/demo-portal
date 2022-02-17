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
  ImageUpdateSavedviewsAPI,
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

  async createGroup(group: GroupCreateSavedviewsAPI, init?: RequestInit) {
    return this.groupsApi.createGroup(this.accessToken, group, ACCEPT, init);
  }

  async getGroup(groupId: string, init?: RequestInit) {
    return this.groupsApi.getGroup(groupId, this.accessToken, ACCEPT, init);
  }

  async updateGroup(
    groupId: string,
    payload: GroupUpdateSavedviewsAPI,
    init?: RequestInit
  ) {
    return this.groupsApi.updateGroup(
      groupId,
      this.accessToken,
      payload,
      ACCEPT,
      init
    );
  }

  async getAllGroups(projectId: string, iModelId?: string, init?: RequestInit) {
    return this.groupsApi.getAllGroups(
      projectId,
      this.accessToken,
      iModelId,
      ACCEPT,
      init
    );
  }

  async deleteGroup(groupId: string, init?: RequestInit) {
    return this.groupsApi.deleteGroup(groupId, this.accessToken, ACCEPT, init);
  }

  async createSavedview(
    payload: SavedViewCreateSavedviewsAPI,
    init?: RequestInit
  ) {
    return this.savedviewsApi.createSavedview(
      this.accessToken,
      payload,
      ACCEPT,
      init
    );
  }

  async getSavedview(id: string, init?: RequestInit) {
    return this.savedviewsApi.getSavedview(id, this.accessToken, ACCEPT, init);
  }

  async updateSavedview(
    id: string,
    payload: SavedViewUpdateSavedviewsAPI,
    init?: RequestInit
  ) {
    return this.savedviewsApi.updateSavedview(
      id,
      this.accessToken,
      payload,
      ACCEPT,
      init
    );
  }

  async getAllGroupSavedviews(
    id: string,
    top = 100,
    skip = 0,
    init?: RequestInit
  ) {
    return this.savedviewsApi.getAllSavedviews(
      this.accessToken,
      undefined,
      undefined,
      id,
      top,
      skip,
      ACCEPT,
      init
    );
  }

  async getAllSavedviews(
    projectId: string,
    iModelId?: string,
    top = 100,
    skip = 0,
    init?: RequestInit
  ) {
    return this.savedviewsApi.getAllSavedviews(
      this.accessToken,
      projectId,
      iModelId,
      undefined,
      top,
      skip,
      ACCEPT,
      init
    );
  }

  async deleteSavedview(id: string, init?: RequestInit) {
    return this.savedviewsApi.deleteSavedview(
      id,
      this.accessToken,
      ACCEPT,
      init
    );
  }

  async createTag(tag: TagCreateSavedviewsAPI, init?: RequestInit) {
    return this.tagsApi.createTag(this.accessToken, tag, ACCEPT, init);
  }

  async getTag(tagId: string, init?: RequestInit) {
    return this.tagsApi.getTag(tagId, this.accessToken, ACCEPT, init);
  }

  async updateTag(
    tagId: string,
    payload: TagUpdateSavedviewsAPI,
    init?: RequestInit
  ) {
    return this.tagsApi.updateTag(
      tagId,
      this.accessToken,
      payload,
      ACCEPT,
      init
    );
  }

  async getAllTags(projectId: string, iModelId?: string, init?: RequestInit) {
    return this.tagsApi.getAllTags(
      projectId,
      this.accessToken,
      iModelId,
      ACCEPT,
      init
    );
  }

  async deleteTag(tagId: string, init?: RequestInit) {
    return this.tagsApi.deleteTag(tagId, this.accessToken, ACCEPT, init);
  }

  async getImage(id: string, init?: RequestInit) {
    return this.imageApi.getImage(id, this.accessToken, "full", ACCEPT, init);
  }

  async getThumbnail(id: string, init?: RequestInit) {
    return this.imageApi.getImage(
      id,
      this.accessToken,
      undefined,
      ACCEPT,
      init
    );
  }

  async addImage(
    id: string,
    payload: ImageUpdateSavedviewsAPI,
    init?: RequestInit
  ) {
    return this.imageApi.addImage(id, this.accessToken, payload, ACCEPT, init);
  }
}
