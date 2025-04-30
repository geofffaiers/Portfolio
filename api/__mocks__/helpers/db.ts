type PoolImpl = {
  query: jest.Mock;
  end: jest.Mock;
};

const poolImpl: PoolImpl = {
    query: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
};

export const pool = new Proxy(poolImpl, {
    get(target, prop) {
        return target[prop as keyof PoolImpl];
    }
});

export const setPoolImpl = (impl: Partial<PoolImpl>) => {
    if (impl.query) poolImpl.query = impl.query;
    if (impl.end) poolImpl.end = impl.end;
};

jest.mock('@src/helpers/db', () => ({
    pool
}));
