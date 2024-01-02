/* eslint-disable */
import type { Route, RouteMapping } from '#/types';


export const ROUTE_MAPPING: RouteMapping = {
  "/api-data/todos": {
    "endpoint": "api/todos",
    "title": "Todos test",
    "path": "/api-data/todos"
  },
  "/api-data/misc": {
    "endpoint": "api/misc",
    "title": "Test data in and out",
    "path": "/api-data/misc"
  },
  "/api-data/hello": {
    "endpoint": "api/hello",
    "title": "Test data in and out",
    "path": "/api-data/hello"
  },
  "/api-data/json-data": {
    "endpoint": "api/json-data",
    "title": "Sample data test",
    "path": "/api-data/json-data"
  },
  "/api-data/health-debug": {
    "endpoint": "api/health/debug",
    "title": "Get debug info",
    "path": "/api-data/health-debug"
  },
  "/api-data/health-check": {
    "endpoint": "api/health/check",
    "title": "Get health check",
    "path": "/api-data/health-check"
  },
  "/api-data/task-tasks": {
    "endpoint": "api/task/tasks",
    "title": "List Tasks",
    "path": "/api-data/task-tasks"
  },
  "/api-data/auth-logout": {
    "endpoint": "api/auth/logout",
    "title": "Log out",
    "path": "/api-data/auth-logout"
  },
  "/api-data/auth-user-all": {
    "endpoint": "api/auth/user/all",
    "title": "Gets a list of all users.",
    "path": "/api-data/auth-user-all"
  },
  "/api-data/auth-session-all": {
    "endpoint": "api/auth/session/all",
    "title": "Fetch all user sessions",
    "path": "/api-data/auth-session-all"
  },
  "/api-data/auth-session": {
    "endpoint": "api/auth/session",
    "title": "Fetch a user session",
    "path": "/api-data/auth-session"
  },
  "/api-data/auth-register-password": {
    "endpoint": "api/auth/register/password",
    "title": "Register a new user via email and password",
    "path": "/api-data/auth-register-password"
  },
  "/api-data/auth-login-github-callback": {
    "endpoint": "api/auth/login/github/callback",
    "title": "Log in via OAuth callback",
    "path": "/api-data/auth-login-github-callback"
  },
  "/api-data/auth-login-github": {
    "endpoint": "api/auth/login/github",
    "title": "Log in via OAuth",
    "path": "/api-data/auth-login-github"
  },
  "/api-data/auth-login-password": {
    "endpoint": "api/auth/login/password",
    "title": "Log in via your email and password",
    "path": "/api-data/auth-login-password"
  }
}