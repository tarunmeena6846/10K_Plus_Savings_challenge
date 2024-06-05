export const resetPassword = (link: string, email: String) => {
  return ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
    </head>
    <body>
      <p>Hi ${email},</p>
      <p>Click <a href=${link}>this link</a> to reset password.</p>
      <p>Peace, Love and Harmony,</p>
      <p>10KSC Admin Team</p>
    </body>
    </html>
    `;
};
