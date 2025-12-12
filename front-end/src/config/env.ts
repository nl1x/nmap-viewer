export interface Env {
  api: {
    baseUrl: string;
    get: {
      hosts: string;
    };
    post: {
      upload: string;
    };
  };
  port: number;
  environnement: string;
  isProduction: () => boolean;
  isDevelopment: () => boolean;
}

const env: Env = {
  api: {
    baseUrl: import.meta.env.API_BASE_URL || "http://localhost:3000",
    get: {
      hosts: "hosts",
    },
    post: {
      upload: "upload",
    },
  },
  port: Number(import.meta.env.APP_PORT) || 3000,
  environnement: import.meta.env.APP_ENVIRONNEMENT || "development",
  isProduction() {
    return this.environnement == "production";
  },
  isDevelopment() {
    return this.environnement == "development";
  },
};

export default env;
