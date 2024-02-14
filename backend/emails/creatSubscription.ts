export const getSubscriptionConfirmationEmail = (name: string) => {
  return ` <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to 10K Plus Savings Challange</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Welcome to 10K Plus Saving Challange !</h1>
          <p>Dear ${name},</p>
          <p>Thank you for subscribing to our Challange. We're excited to have you on board!</p>
          <p>We promise not to spam your inbox and only send you relevant content.</p>
          <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
          <p>Best regards,<br> 10K Plus Savings Challange Team</p>
        </div>
      </body>
      </html>`;
};
