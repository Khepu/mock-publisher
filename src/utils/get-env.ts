export const getEnv = (envName: string, isOptional = false) => {
  const envValue = process.env[`${envName}`];
  if (envValue) {
    return envValue;
  } else if (isOptional) {
    return '';
  } else {
    throw new Error(`Invalid Environment Variable ${envName} ${envValue}`);
  }
};
