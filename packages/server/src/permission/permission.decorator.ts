import { SetMetadata } from '@nestjs/common';

export const HasPermissions = (...permissions: string[]) => {
  return SetMetadata('permissions', permissions);
};
