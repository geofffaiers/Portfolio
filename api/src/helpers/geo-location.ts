import IPinfoWrapper, { IPinfo } from 'node-ipinfo';

interface GeoLocationData {
  city?: string;
  region?: string;
  country?: string;
  location?: string;
}

const ipinfoClient = new IPinfoWrapper(process.env.IPINFO_API_KEY || '');

export async function getLocationFromIp(ip: string): Promise<GeoLocationData> {
    try {
        // Handle empty/invalid IPs
        if (!ip || ip === 'unknown') {
            return { location: 'Unknown' };
        }

        // Handle localhost and private networks
        if (
            ip === '127.0.0.1' ||
            ip === 'localhost' ||
            ip.startsWith('192.168.') ||
            ip.startsWith('10.') ||
            ip.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) || // Private range
            ip.match(/^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./) || // CGNAT range
            ip === '::1' || // IPv6 localhost
            ip.startsWith('fc00:') || // IPv6 private
            ip.startsWith('fd') // IPv6 unique local
        ) {
            return { location: 'Local/Private Network' };
        }

        // Handle link-local addresses
        if (ip.startsWith('169.254.') || ip.startsWith('fe80:')) {
            return { location: 'Link-local Address' };
        }

        const response: IPinfo = await ipinfoClient.lookupIp(ip);

        // Handle bogon response
        if (response.bogon) {
            return { location: 'Private/Reserved IP' };
        }

        return {
            city: response.city,
            region: response.region,
            country: response.country,
            location: response.city && response.country
                ? `${response.city}, ${response.country}`
                : response.country || 'Unknown Location'
        };
    } catch (_error) {
        return { location: 'Location Lookup Failed' };
    }
}
