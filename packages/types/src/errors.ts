export type AuthError = {
  status: 401;
  message: 'Forbidden';
};

export type ServerError = {
  status: 500;
  message: 'Internal Server Error';
};
