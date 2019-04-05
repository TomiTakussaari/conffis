import fromSsm from './ssm';
import { Config } from './types';

export const getEnvValue = async (key: string, defaultValue?: string, config?: Config): Promise<string> => {
  const envValue = process.env[key] || defaultValue;
  if (envValue && envValue.toLowerCase().startsWith('ssm-secure:')) {
    return await fromSsm(envValue.substring(11), true, config);
  }
  if (envValue && envValue.toLowerCase().startsWith('ssm:')) {
    return await fromSsm(envValue.substring(4), false, config);
  }
  return envValue;
};
