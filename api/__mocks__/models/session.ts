export const mockSession = () => ({
  id: 1,
  userId: 42,
  refreshToken: 'mock-refresh-token',
  userAgent: 'Mozilla/5.0',
  ipAddress: '127.0.0.1',
  location: 'Testville',
  isActive: true,
  thisSession: false,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-02T10:00:00Z'),
  expiresAt: new Date('2024-12-31T23:59:59Z')
});

export const mockSessionAlt = () => ({
  id: 2,
  userId: 99,
  refreshToken: 'alt-refresh-token',
  userAgent: 'Chrome/120.0',
  ipAddress: '192.168.1.1',
  location: 'Alt City',
  isActive: false,
  thisSession: true,
  createdAt: new Date('2024-02-01T10:00:00Z'),
  updatedAt: new Date('2024-02-02T10:00:00Z'),
  expiresAt: new Date('2025-01-31T23:59:59Z')
});
