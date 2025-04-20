import { MockIPinfoWrapperStatic } from '@mocks/node-ipinfo';
import { getLocationFromIp } from '@src/helpers/geo-location';
import IPinfoWrapper from 'node-ipinfo';

describe('getLocationFromIp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => ({});
  });

  it.each([
    ['should return Unknown for empty IP', '', { location: 'Unknown' }],
    ['should return Unknown for "unknown" IP', 'unknown', { location: 'Unknown' }],
    ['should return Local/Private Network for 127.0.0.1', '127.0.0.1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for localhost', 'localhost', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for 192.168.x.x', '192.168.1.1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for 10.x.x.x', '10.0.0.1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for 172.16.x.x', '172.16.0.1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for 100.64.x.x', '100.64.0.1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for ::1', '::1', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for fc00::', 'fc00::', { location: 'Local/Private Network' }],
    ['should return Local/Private Network for fd00::', 'fd00::', { location: 'Local/Private Network' }],
    ['should return Link-local Address for 169.254.x.x', '169.254.1.1', { location: 'Link-local Address' }],
    ['should return Link-local Address for fe80::', 'fe80::1', { location: 'Link-local Address' }],
  ])('%s', async (_desc, ip, expected) => {
    const result = await getLocationFromIp(ip);

    expect(result).toEqual(expected);
  });

  it('should return Private/Reserved IP for bogon response', async () => {
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => ({ bogon: true });

    const result = await getLocationFromIp('8.8.8.8');

    expect(result).toEqual({ location: 'Private/Reserved IP' });
  });

  it('should return formatted location for valid city and country', async () => {
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => ({
      city: 'Example City',
      region: 'Example Region',
      country: 'EX'
    });

    const result = await getLocationFromIp('123.123.123.123');

    expect(result).toEqual({
      city: 'Example City',
      region: 'Example Region',
      country: 'EX',
      location: 'Example City, EX'
    });
  });

  it('should return country as location if city is missing', async () => {
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => ({
      city: undefined,
      region: 'Example Region',
      country: 'EX'
    });

    const result = await getLocationFromIp('123.123.123.123');

    expect(result).toEqual({
      city: undefined,
      region: 'Example Region',
      country: 'EX',
      location: 'EX'
    });
  });

  it('should return Unknown Location if city and country are missing', async () => {
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => ({
      city: undefined,
      region: undefined,
      country: undefined
    });

    const result = await getLocationFromIp('123.123.123.123');

    expect(result).toEqual({
      city: undefined,
      region: undefined,
      country: undefined,
      location: 'Unknown Location'
    });
  });

  it('should return Location Lookup Failed on error', async () => {
    (IPinfoWrapper as unknown as MockIPinfoWrapperStatic).lookupIpImpl = async () => {
      throw new Error('fail');
    };

    const result = await getLocationFromIp('8.8.8.8');

    expect(result).toEqual({ location: 'Location Lookup Failed' });
  });
});