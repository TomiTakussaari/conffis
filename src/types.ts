import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export interface ConfigObject {
  [x: string]: string;
}

export interface Config extends ServiceConfigurationOptions {

}
