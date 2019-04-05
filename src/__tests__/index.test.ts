import { FromEnv } from '../decorators';
import getConfiguration from '../index';

const mockGetParameter = jest.fn();
const mockGetParameterSecure = jest.fn();

class MockSsm {
  public getParameter(params: any): any {
    if (params.WithDecryption === true) {
      return mockGetParameterSecure(params);
    }
    return mockGetParameter(params);

  }
}
jest.mock('aws-sdk', () => {
  return {
    SSM: MockSsm,
  };
});

const mockPromise = (retValue: any) => {
  return {
    promise: async () => {
      return { Parameter: { Value: retValue } };
    },
  };
};

class ConfigObject {
  [x: string]: string;

  @FromEnv('FROM_SSM')
  public fromSsm: string;
  @FromEnv('FROM_SSM_SECURE')
  public fromSsmSecure: string;
  @FromEnv('FROM_ENV')
  public fromEnv: string;
  @FromEnv('EMPTY', { default: 'from-default' })
  public fromDefault: string;
}

process.env.FROM_SSM = 'ssm:/foo/bar';
process.env.FROM_SSM_SECURE = 'ssm-secure:/foo/secure';
process.env.FROM_ENV = 'THIS CAME FROM ENV DIRECTLY';
mockGetParameterSecure.mockReturnValue(mockPromise('came-from-ssm-secure'));
mockGetParameter.mockReturnValue(mockPromise('came-from-ssm'));

it('reads configuration based on decorators', async () => {

  const config = await getConfiguration<ConfigObject>(ConfigObject);
  expect(mockGetParameterSecure).toHaveBeenCalledWith({
    Name: '/foo/secure',
    WithDecryption: true,
  });
  expect(mockGetParameter).toHaveBeenCalledWith({
    Name: '/foo/bar',
    WithDecryption: false,
  });
  expect(config.fromSsm).toEqual('came-from-ssm');
  expect(config.fromSsmSecure).toEqual('came-from-ssm-secure');
  expect(config.fromEnv).toEqual('THIS CAME FROM ENV DIRECTLY');
  expect(config.fromDefault).toEqual('from-default');
});

it('returns default object if no decorators', async () => {
  class EmptyObject {
    [x: string]: string;
  }

  const config = await getConfiguration<EmptyObject>(EmptyObject);
  expect(config).toEqual({});
});
