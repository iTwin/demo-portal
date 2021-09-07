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
  RoleCreateProjectsAPI,
  RoleUpdateProjectsAPI,
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
   * See {@link ProjectRolesApi.createProjectRole} for details.
   * @param projectId
   * @param role
   * @returns
   */
  async createProjectRole(projectId: string, role: RoleCreateProjectsAPI) {
    return this.rolesApi.createProjectRole(
      projectId,
      this.accessToken,
      role,
      ACCEPT
    );
  }

  /**
   * See {@link ProjectRolesApi.updateProjectRole} for details.
   * @param projectId
   * @param roleId
   * @param role
   * @returns
   */
  async updateProjectRole(
    projectId: string,
    roleId: string,
    role: RoleUpdateProjectsAPI
  ) {
    return this.rolesApi.updateProjectRole(
      projectId,
      roleId,
      this.accessToken,
      role,
      ACCEPT
    );
  }

  /**
   * See {@link ProjectRolesApi.getProjectRoles} for details.
   * @param projectId
   * @returns
   */
  async getProjectRoles(projectId: string) {
    return this.rolesApi.getProjectRoles(projectId, this.accessToken, ACCEPT);
  }

  /**
   * See {@link ProjectRolesApi.deleteProjectRole} for details.
   * @param projectId
   * @param roleId
   * @returns
   */
  async deleteProjectRole(projectId: string, roleId: string) {
    return this.rolesApi.deleteProjectRole(
      projectId,
      roleId,
      this.accessToken,
      ACCEPT
    );
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
   * See {@link ProjectUsersApi.updateProjectTeamMemberRoles} for details
   * @param projectId
   * @param memberId
   * @param roleIds
   * @returns
   */
  async updateProjectMemberRoles(
    projectId: string,
    memberId: string,
    roleIds: string[]
  ) {
    return this.usersApi.updateProjectTeamMemberRoles(
      projectId,
      memberId,
      this.accessToken,
      { roleIds },
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
