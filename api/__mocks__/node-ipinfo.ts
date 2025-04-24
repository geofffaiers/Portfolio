import IPinfoWrapper from 'node-ipinfo';

export interface MockIPinfoWrapperStatic extends IPinfoWrapper {
    lookupIpImpl: (ip: string) => Promise<unknown>;
}

class MockIPinfoWrapper {
    static lookupIpImpl = async (_ip: string) => ({});

    lookupIp(ip: string) {
        return MockIPinfoWrapper.lookupIpImpl(ip);
    }
}

module.exports = {
    __esModule: true,
    default: MockIPinfoWrapper,
    IPinfoWrapper: MockIPinfoWrapper
};
