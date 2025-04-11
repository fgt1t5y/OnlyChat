import * as bcrypt from 'bcrypt';

export const encryptPassword = (raw: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(raw, salt);
};

export const comparePassword = (pwd: string, hash: string) =>
  bcrypt.compareSync(pwd, hash);
