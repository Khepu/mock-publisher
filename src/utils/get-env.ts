export const getEnv = (envName: string) => {
  const stage = process.env.STAGE;
  const envValue = process.env[stage + '_' + envName];

  if (envValue) {
    return envValue;
  } else {
    throw new Error('Invalid Environment Variable ' + envName + ' ' + envValue);
  }
};
