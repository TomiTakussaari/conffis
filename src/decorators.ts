import 'reflect-metadata';

const metaDataLabel = 'configProperty';

type DecoratorOpts = {
  default?: string;
};

type Decoratordata = {
  opts: DecoratorOpts;
  propertyKey: string;
  envVariable: string;
  type: ConfigType;
};

export enum ConfigType {
  fromEnv = 'fromEnv',
}

export function FromEnv(envVariable: string, opts?: DecoratorOpts): (target: any, propertyKey: string) => void {
  return function (target: any, propertyKey: string): void {
    defineMetadata(target, propertyKey, envVariable, opts, ConfigType.fromEnv);
  };
}

export function getConfigProperties(object: any): Decoratordata[] {
  return Reflect.getMetadata(metaDataLabel, object) || [];
}

function defineMetadata(target: any, propertyKey: string, envVariable: string, opts: DecoratorOpts = {}, type: ConfigType): void {
  const properties: Decoratordata[] = Reflect.getMetadata(metaDataLabel, target) || [];
  if (properties.findIndex(editable => editable.propertyKey === propertyKey) < 0) {
    properties.push({ envVariable, propertyKey, opts, type });
  }
  Reflect.defineMetadata(metaDataLabel, properties, target);
}
