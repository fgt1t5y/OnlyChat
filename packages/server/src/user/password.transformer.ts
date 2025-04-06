import { encryptPassword } from 'src/utils';
import { ValueTransformer } from 'typeorm';

export class PasswordTransformer implements ValueTransformer {
  to(value: string) {
    return encryptPassword(value);
  }

  from(value: string) {
    return value;
  }
}
