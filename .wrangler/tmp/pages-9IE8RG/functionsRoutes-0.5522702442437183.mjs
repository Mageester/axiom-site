import { onRequestPost as __api_auth_change_password_ts_onRequestPost } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\auth\\change-password.ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\auth\\login.ts"
import { onRequestPost as __api_auth_logout_ts_onRequestPost } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\auth\\logout.ts"
import { onRequestGet as __api_auth_me_ts_onRequestGet } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\auth\\me.ts"
import { onRequestPost as __api_jobs_run_ts_onRequestPost } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\jobs\\run.ts"
import { onRequestGet as __api_leads__id__index_ts_onRequestGet } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\leads\\[id]\\index.ts"
import { onRequestPatch as __api_leads__id__index_ts_onRequestPatch } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\leads\\[id]\\index.ts"
import { onRequestGet as __api_campaigns_index_ts_onRequestGet } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\campaigns\\index.ts"
import { onRequestPost as __api_campaigns_index_ts_onRequestPost } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\campaigns\\index.ts"
import { onRequestGet as __api_jobs_index_ts_onRequestGet } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\jobs\\index.ts"
import { onRequestGet as __api_leads_index_ts_onRequestGet } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\leads\\index.ts"
import { onRequest as __api__middleware_ts_onRequest } from "C:\\Users\\aidan\\OneDrive\\Desktop\\Axiom LLC\\functions\\api\\_middleware.ts"

export const routes = [
    {
      routePath: "/api/auth/change-password",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_change_password_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_ts_onRequestGet],
    },
  {
      routePath: "/api/jobs/run",
      mountPath: "/api/jobs",
      method: "POST",
      middlewares: [],
      modules: [__api_jobs_run_ts_onRequestPost],
    },
  {
      routePath: "/api/leads/:id",
      mountPath: "/api/leads/:id",
      method: "GET",
      middlewares: [],
      modules: [__api_leads__id__index_ts_onRequestGet],
    },
  {
      routePath: "/api/leads/:id",
      mountPath: "/api/leads/:id",
      method: "PATCH",
      middlewares: [],
      modules: [__api_leads__id__index_ts_onRequestPatch],
    },
  {
      routePath: "/api/campaigns",
      mountPath: "/api/campaigns",
      method: "GET",
      middlewares: [],
      modules: [__api_campaigns_index_ts_onRequestGet],
    },
  {
      routePath: "/api/campaigns",
      mountPath: "/api/campaigns",
      method: "POST",
      middlewares: [],
      modules: [__api_campaigns_index_ts_onRequestPost],
    },
  {
      routePath: "/api/jobs",
      mountPath: "/api/jobs",
      method: "GET",
      middlewares: [],
      modules: [__api_jobs_index_ts_onRequestGet],
    },
  {
      routePath: "/api/leads",
      mountPath: "/api/leads",
      method: "GET",
      middlewares: [],
      modules: [__api_leads_index_ts_onRequestGet],
    },
  {
      routePath: "/api",
      mountPath: "/api",
      method: "",
      middlewares: [__api__middleware_ts_onRequest],
      modules: [],
    },
  ]