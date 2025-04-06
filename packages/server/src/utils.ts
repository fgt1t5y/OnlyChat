import * as bcrypt from 'bcrypt';

export const encryptPassword = (raw: string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(raw, salt);
};

export const comparePassword = (pwd: string, hash: string) =>
  bcrypt.compareSync(pwd, hash);

export const makeRandomString = () => {
  return;
};

export const ok = (data: object) => ({ success: true, statusCode: 200, data });

export const no = (statusCode: number, message?: string) => ({
  success: false,
  statusCode,
  message,
});
