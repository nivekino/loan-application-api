export interface Config {
    MONGO_ATLAS_USER: string;
    MONGO_ATLAS_PASS: string;
    MONGO_ATLAS_CLUSTER: string;
    MONGO_ATLAS_DB: string;
    MONGODB_URI: string;
    JWT_SECRETS: string;
    SENTRY_DSN: string;
    SENTRY_RELEASE: string;
}
declare const config: Config;
export { config };
