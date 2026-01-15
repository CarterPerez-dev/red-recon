// ===================
// © AngelaMos | 2026
// config.ts
// ===================

const API_VERSION = 'v1'

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/${API_VERSION}/auth/login-mobile`,
    REFRESH: `/${API_VERSION}/auth/refresh`,
    REFRESH_MOBILE: `/${API_VERSION}/auth/refresh-mobile`,
    LOGOUT: `/${API_VERSION}/auth/logout`,
    LOGOUT_ALL: `/${API_VERSION}/auth/logout-all`,
    ME: `/${API_VERSION}/auth/me`,
    CHANGE_PASSWORD: `/${API_VERSION}/auth/change-password`,
  },
  USERS: {
    BASE: `/${API_VERSION}/users`,
    BY_ID: (id: string) => `/${API_VERSION}/users/${id}`,
    ME: `/${API_VERSION}/users/me`,
    REGISTER: `/${API_VERSION}/users`,
  },
  PARTNERS: {
    ME: `/${API_VERSION}/partners/me`,
    EXISTS: `/${API_VERSION}/partners/me/exists`,
  },
  PERIODS: {
    BASE: `/${API_VERSION}/partners/me/periods`,
    BY_ID: (id: string) => `/${API_VERSION}/partners/me/periods/${id}`,
    CURRENT: `/${API_VERSION}/partners/me/periods/current`,
  },
  DAILY_LOGS: {
    BASE: `/${API_VERSION}/partners/me/daily-logs`,
    BY_DATE: (date: string) => `/${API_VERSION}/partners/me/daily-logs/${date}`,
  },
  CYCLE: {
    CURRENT: `/${API_VERSION}/partners/me/cycle/current`,
    PHASES: `/${API_VERSION}/partners/me/cycle/phases`,
    CALENDAR: (year: number, month: number) =>
      `/${API_VERSION}/partners/me/cycle/calendar/${year}/${month}`,
    PATTERNS: `/${API_VERSION}/partners/me/cycle/patterns`,
  },
} as const

export const QUERY_KEYS = {
  AUTH: {
    ALL: ['auth'] as const,
    ME: () => [...QUERY_KEYS.AUTH.ALL, 'me'] as const,
  },
  USERS: {
    ALL: ['users'] as const,
    BY_ID: (id: string) => [...QUERY_KEYS.USERS.ALL, 'detail', id] as const,
    ME: () => [...QUERY_KEYS.USERS.ALL, 'me'] as const,
  },
  PARTNERS: {
    ALL: ['partners'] as const,
    ME: () => [...QUERY_KEYS.PARTNERS.ALL, 'me'] as const,
    EXISTS: () => [...QUERY_KEYS.PARTNERS.ALL, 'exists'] as const,
  },
  PERIODS: {
    ALL: ['periods'] as const,
    LIST: () => [...QUERY_KEYS.PERIODS.ALL, 'list'] as const,
    BY_ID: (id: string) => [...QUERY_KEYS.PERIODS.ALL, 'detail', id] as const,
    CURRENT: () => [...QUERY_KEYS.PERIODS.ALL, 'current'] as const,
  },
  DAILY_LOGS: {
    ALL: ['daily-logs'] as const,
    LIST: () => [...QUERY_KEYS.DAILY_LOGS.ALL, 'list'] as const,
    BY_DATE: (date: string) => [...QUERY_KEYS.DAILY_LOGS.ALL, 'detail', date] as const,
  },
  CYCLE: {
    ALL: ['cycle'] as const,
    CURRENT: () => [...QUERY_KEYS.CYCLE.ALL, 'current'] as const,
    PHASES: () => [...QUERY_KEYS.CYCLE.ALL, 'phases'] as const,
    CALENDAR: (year: number, month: number) =>
      [...QUERY_KEYS.CYCLE.ALL, 'calendar', year, month] as const,
    PATTERNS: () => [...QUERY_KEYS.CYCLE.ALL, 'patterns'] as const,
  },
} as const

export const QUERY_CONFIG = {
  STALE_TIME: {
    USER: 1000 * 60 * 5,
    PARTNER: 1000 * 60 * 10,
    CYCLE: 1000 * 60 * 5,
    CALENDAR: 1000 * 60 * 15,
    STATIC: Number.POSITIVE_INFINITY,
    FREQUENT: 1000 * 30,
  },
  GC_TIME: {
    DEFAULT: 1000 * 60 * 30,
    LONG: 1000 * 60 * 60,
  },
  RETRY: {
    DEFAULT: 3,
    NONE: 0,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER: 500,
} as const

export const PASSWORD_CONSTRAINTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_SIZE: 20,
  MAX_SIZE: 100,
} as const

export type ApiEndpoint = typeof API_ENDPOINTS
export type QueryKey = typeof QUERY_KEYS
