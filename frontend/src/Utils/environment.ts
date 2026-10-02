const configuredEnvironment = import.meta.env.VITE_ENVIRONMENT?.trim().toLowerCase();

export const isDevelopmentEnvironment =
  (configuredEnvironment || import.meta.env.MODE.toLowerCase()) === "development";