import { ExtractPluginField, HasRequiredKeys, InferPluginFieldFromTuple, IsAny, OverrideMerge, Prettify, PrettifyDeep, RequiredKeysOf, StripEmptyObjects, UnionToIntersection } from "../types/helper.mjs";
import { CamelCase, InferCtx, InferRoute, InferRoutes, InferSessionUpdateCtx, InferSignUpEmailCtx, InferUserUpdateCtx, MergeRoutes, PathToObject, ProxyRequest } from "./path-to-object.mjs";
import { BetterAuthClientOptions, BetterAuthClientPlugin, ClientAtomListener, ClientStore, InferActions, InferAdditionalFromClient, InferClientAPI, InferErrorCodes, InferSessionFromClient, InferUserFromClient, IsSignal, SessionQueryParams } from "./types.mjs";
import { BroadcastChannel, BroadcastListener, BroadcastMessage, getGlobalBroadcastChannel, kBroadcastChannel } from "./broadcast-channel.mjs";
import { isJsonEqual, withEquality } from "./equality.mjs";
import { FocusListener, FocusManager, kFocusManager } from "./focus-manager.mjs";
import { OnlineListener, OnlineManager, kOnlineManager } from "./online-manager.mjs";
import { parseJSON } from "./parser.mjs";
import { AuthQueryAtom, AuthQueryState, useAuthQuery } from "./query.mjs";
import { SessionRefreshOptions, createSessionRefreshManager } from "./session-refresh.mjs";
import { AuthClient, createAuthClient } from "./vanilla.mjs";
import { AccessControl, ArrayElement, ExactRoleStatements, Role, RoleAuthorizeRequest, RoleInput, RoleStatements, Statements, SubArray, Subset } from "../plugins/access/types.mjs";
import { AuthorizeResponse, createAccessControl, role } from "../plugins/access/access.mjs";
import "../plugins/access/index.mjs";
import { OrganizationOptions } from "../plugins/organization/types.mjs";
import { InferInvitation, InferMember, InferOrganization, InferOrganizationRolesFromOption, InferOrganizationZodRolesFromOption, InferTeam, Invitation, InvitationInput, InvitationStatus, Member, MemberInput, Organization, OrganizationInput, OrganizationRole, OrganizationSchema, Team, TeamInput, TeamMember, TeamMemberInput, defaultRolesSchema, invitationSchema, invitationStatus, memberSchema, organizationRoleSchema, organizationSchema, roleSchema, teamMemberSchema, teamSchema } from "../plugins/organization/schema.mjs";
import { getOrgAdapter } from "../plugins/organization/adapter.mjs";
import { hasPermission } from "../plugins/organization/has-permission.mjs";
import { DefaultOrganizationPlugin, DynamicAccessControlEndpoints, OrganizationCreator, OrganizationEndpoints, OrganizationPlugin, TeamEndpoints, organization, parseRoles } from "../plugins/organization/organization.mjs";
import "../plugins/organization/index.mjs";
import { BetterAuthOptions, BetterAuthPlugin } from "@better-auth/core";
import { DBPrimitive } from "@better-auth/core/db";
export type * from "@better-auth/core/db";
export type * from "nanostores";
export type * from "@better-fetch/fetch";
//#region src/client/index.d.ts
declare const InferPlugin: <T extends BetterAuthPlugin>() => {
  id: "infer-server-plugin";
  version: string;
  $InferServerPlugin: T;
};
declare function InferAuth<O extends {
  options: BetterAuthOptions;
}>(): O["options"];
//#endregion
export { type AccessControl, type ArrayElement, AuthClient, AuthQueryAtom, AuthQueryState, type AuthorizeResponse, type BetterAuthClientOptions, type BetterAuthClientPlugin, BroadcastChannel, BroadcastListener, BroadcastMessage, type CamelCase, type ClientAtomListener, type ClientStore, type DBPrimitive, type DefaultOrganizationPlugin, type DynamicAccessControlEndpoints, type ExactRoleStatements, type ExtractPluginField, type FocusListener, type FocusManager, type HasRequiredKeys, InferActions, InferAdditionalFromClient, InferAuth, InferClientAPI, type InferCtx, InferErrorCodes, type InferInvitation, type InferMember, type InferOrganization, type InferOrganizationRolesFromOption, type InferOrganizationZodRolesFromOption, InferPlugin, type InferPluginFieldFromTuple, type InferRoute, type InferRoutes, InferSessionFromClient, type InferSessionUpdateCtx, type InferSignUpEmailCtx, type InferTeam, InferUserFromClient, type InferUserUpdateCtx, type Invitation, type InvitationInput, type InvitationStatus, type IsAny, IsSignal, type Member, type MemberInput, type MergeRoutes, type OnlineListener, type OnlineManager, type Organization, type OrganizationCreator, type OrganizationEndpoints, type OrganizationInput, type OrganizationOptions, type OrganizationPlugin, type OrganizationRole, type OrganizationSchema, type OverrideMerge, type PathToObject, type Prettify, type PrettifyDeep, type ProxyRequest, type RequiredKeysOf, type Role, type RoleAuthorizeRequest, type RoleInput, type RoleStatements, SessionQueryParams, SessionRefreshOptions, type Statements, type StripEmptyObjects, type SubArray, type Subset, type Team, type TeamEndpoints, type TeamInput, type TeamMember, type TeamMemberInput, type UnionToIntersection, type createAccessControl, createAuthClient, createSessionRefreshManager, type defaultRolesSchema, getGlobalBroadcastChannel, type getOrgAdapter, type hasPermission, type invitationSchema, type invitationStatus, isJsonEqual, kBroadcastChannel, kFocusManager, kOnlineManager, type memberSchema, type organization, type organizationRoleSchema, type organizationSchema, parseJSON, type parseRoles, type role, type roleSchema, type teamMemberSchema, type teamSchema, useAuthQuery, withEquality };