export const getWelcomeEmail = (token: string) => {
  return `<p>Please click <a href="http://localhost:5173/verify-email/${token}">here</a> to verify your email.</p>`;
};
