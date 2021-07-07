/* eslint-disable @typescript-eslint/ban-types */
import { Enforcer } from 'casbin';

// export type MockType<T> = {
//   [P in keyof T]?: jest.Mock<{}>;
// };

export const casbinEnforcerMockFactory: () => Partial<Enforcer> = jest.fn(
  () => ({
    getRolesForUser: async () => [],
    addRoleForUser: async () => true,
    addGroupingPolicy: async () => true,
  }),
);
