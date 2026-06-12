import jwt from 'jsonwebtoken';

export const generateToken = (id, rememberMe = false) => {
  const expiresIn = rememberMe
    ? process.env.JWT_REMEMBER_EXPIRE || '30d'
    : process.env.JWT_EXPIRE || '7d';

  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};
