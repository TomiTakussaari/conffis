import { Config } from '../types';

const fromSsm = async (key: string, secure: boolean, config?: Config): Promise<string> => {
  const AWS = require('aws-sdk');
  const ssm = new AWS.SSM(config);
  const param = await ssm.getParameter({
        Name: key,
        WithDecryption: secure,
    }).promise();
  return param.Parameter.Value;
};

export default fromSsm;
