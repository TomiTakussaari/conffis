import { ConfigType, getConfigProperties } from './decorators';
import { getEnvValue } from './get-value';
import { Config, ConfigObject } from './types';

async function getConfiguration<T extends ConfigObject>(modelConstructor: new () => T, config?: Config): Promise<T> {
  const model = new modelConstructor();
  const props = getConfigProperties(model);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (prop.type === ConfigType.fromEnv) {
      model[prop.propertyKey] = await getEnvValue(prop.envVariable, prop.opts.default, config);
    }
  }
  return model;
}

export default getConfiguration;
