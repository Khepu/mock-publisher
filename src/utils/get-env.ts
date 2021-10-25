export const getEnv = (envName: string, isOptional = false, defaultVal?: string): string => {
  const envValue = process.env[envName] || defaultVal;

  if (envValue !== undefined) {
    return envValue;
  } else if (isOptional) {
    return '';
  } else {
    throw new Error(`Invalid Environment Variable ${envName} ${envValue}`);
  }
};
