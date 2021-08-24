/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *
 * This code is for demonstration purposes and should not be considered production ready.
 *--------------------------------------------------------------------------------------------*/
import { prefixUrl } from "../useApiPrefix";
import {
  BASE_PATH,
  ProjectFavoritesApi,
  ProjectRecentsApi,
  ProjectRolesApi,
  ProjectsApi,
  ProjectUsersApi,
  TeamMemberAddByNamesProjectsAPI,
} from "./generated";

const ACCEPT = "application/vnd.bentley.itwin-platform.v1+json";
export class ProjectsClient {
  private favoritesApi: ProjectFavoritesApi;
  private recentsApi: ProjectRecentsApi;
  private rolesApi: ProjectRolesApi;
  private usersApi: ProjectUsersApi;
  private projectsApi: ProjectsApi;
  constructor(urlPrefix: string, private accessToken: string) {
    const baseUrl = prefixUrl(BASE_PATH, urlPrefix);
    this.favoritesApi = new ProjectFavoritesApi(undefined, baseUrl);
    this.recentsApi = new ProjectRecentsApi(undefined, baseUrl);
    this.rolesApi = new ProjectRolesApi(undefined, baseUrl);
    this.usersApi = new ProjectUsersApi(undefined, baseUrl);
    this.projectsApi = new ProjectsApi(undefined, baseUrl);
  }

  /**
   * See {@link ProjectUsersApi.getProjectTeamMembers} for details.
   * @param projectId
   * @returns
   */
  async getProjectUsers(projectId: string) {
    return this.usersApi.getProjectTeamMembers(
      projectId,
      this.accessToken,
      undefined,
      undefined,
      ACCEPT
    );
  }

  /**
   * See {@link ProjectUsersApi.addProjectTeamMember} for details.
   * @param projectId
   * @param email
   * @param roles
   * @returns
   */
  async addProjectMember(projectId: string, email: string, roles?: string[]) {
    const newUser: TeamMemberAddByNamesProjectsAPI = {
      email,
      roleNames: roles ?? [],
    };
    return this.usersApi.addProjectTeamMember(
      projectId,
      this.accessToken,
      newUser as any,
      ACCEPT
    );
  }

  /**
   * See {@link ProjectUsersApi.removeProjectTeamMember} for details.
   * @param projectId
   * @param memberId
   * @returns
   */
  async removeProjectMember(projectId: string, memberId: string) {
    return this.usersApi.removeProjectTeamMember(
      projectId,
      memberId,
      this.accessToken,
      ACCEPT
    );
  }

  /**
   *
   * @param errorResponse
   * @returns
   */
  async extractAPIErrorMessage(errorResponse: Response) {
    try {
      const errorObject = await errorResponse.json();
      return errorObject?.error?.message ?? (await errorResponse.text());
    } catch (error) {
      return errorResponse;
    }
  }
}
