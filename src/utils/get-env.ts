export const getEnv = (envName: string, isOptional = false) => {
  const stage = process.env.STAGE;
  const envValue = process.env[`${stage}_${envName}`];

  if (envValue) {
    return envValue;
  } else if (isOptional) {
    return '';
  } else {
    throw new Error(`Invalid Environment Variable ${envName} ${envValue}`);
  }
};
