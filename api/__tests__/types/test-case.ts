export type TestCase<TController, TService> = {
  method: keyof TController;
  service: keyof TService;
  response: { code: number; success: boolean; data: unknown };
  passRes?: boolean;
};
