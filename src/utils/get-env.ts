export const getEnv = (envName: string) => {
  const envValue = process.env[envName];
  if (envValue) {
    return envValue;
  } else {
    throw new Error('Invalid Environment Variable ' + envName + ' ' + envValue);
  }
};
