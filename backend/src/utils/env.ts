export enum EnvironmentType {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

interface EnvKeys {
  SESSION_KEY: string;
  DB_URL: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  NODE_ENV: EnvironmentType;
  COOKIE_NAME: string;
}

const keys = ['SESSION_KEY', 'DB_URL', 'DB_USERNAME', 'DB_PASSWORD', 'NODE_ENV', 'COOKIE_NAME'] as const;

export const environment: Readonly<EnvKeys> = (() => {
  const newEnvVars: EnvKeys = {
    SESSION_KEY: '',
    DB_URL: '',
    DB_USERNAME: '',
    DB_PASSWORD: '',
    NODE_ENV: EnvironmentType.DEVELOPMENT,
    COOKIE_NAME: '',
  };
  keys.forEach((key) => {
    const val = process.env[key];
    if (!val || val === '') {
      throw new Error(`Missing required environment variable ${key}. Create .env file if missing.`);
    } else if (key === 'NODE_ENV') {
      newEnvVars.NODE_ENV = val as EnvironmentType;
    } else {
      newEnvVars[key] = val;
    }
  });
  return newEnvVars;
})();
