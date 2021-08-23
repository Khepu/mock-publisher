import { Configuration } from '../types';

type ConfigRules = {
  [key: string]: (config: Configuration) => boolean;
};

const configRules: ConfigRules = {
  carlaRule: config => !config.isEnvironmentInstance
    || (config.isEnvironmentInstance !== undefined
      && config.isEnvironmentInstance
      && config.host !== undefined
      && config.host !== '')
};

export const validate = (config: Configuration): Configuration => {
  const isValid = Object
    .values(configRules)
    .reduce((isValid, validator) => isValid && validator(config), true)

  if (isValid) {
    return config;
  } else {
    throw new Error('Invalid schema');
  }
};
