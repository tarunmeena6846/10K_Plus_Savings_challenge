export const getWelcomeEmail = (token: string) => {
  return `<p>Please click <a href=${process.env.RETURN_CLIENT_URL}/verify-email/${token}>here</a> to verify your email.</p>`;
};
