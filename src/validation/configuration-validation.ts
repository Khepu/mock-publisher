import { Configuration } from '../types';

type ConfigRules = {
  [key: string]: (config: Configuration) => boolean;
};

const configRules: ConfigRules = {
  carlaRule: config =>
    (config.isEnvironmentInstance !== undefined &&
      config.isEnvironmentInstance &&
      config.host !== undefined &&
      config.host !== '') ||
    !config.isEnvironmentInstance,
};

export const validate = (config: Configuration) => {
  if (Object.values(configRules).reduce((acc, cur) => acc && cur(config), true))
    return true;
  else throw new Error('Invalid schema');
};
