const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if (value === undefined) {
        throw new Error(`Missing environment variable ${key}`);
    }
    return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const MONGO_URI = getEnv("MONGO_URI");
export const PORT = getEnv("PORT", "4004");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const APP_ORIGIN = getEnv("APP_ORIGIN");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const EMAIL_SERVICE = getEnv("EMAIL_SERVICE");
export const EMAIL_SERVICE_HOST = getEnv("EMAIL_SERVICE_HOST");
export const EMAIL_SENDER_PASSWORD = getEnv("EMAIL_SENDER_PASSWORD");
export const DEFAULT_TEMP_PASSWORD = getEnv("DEFAULT_TEMP_PASSWORD");
