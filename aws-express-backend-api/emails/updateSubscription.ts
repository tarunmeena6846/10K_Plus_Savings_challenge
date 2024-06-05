export const getSubscriptionUpdateEmail = (name: string) => {
  return `  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Subscribing!</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1>Thank You for Subscribing!</h1>
    <p>Dear ${name},</p>
    <p>Thank you for subscribing to our website. We're thrilled to have you as part of our community!</p>
    <p>Stay tuned for exciting updates and exclusive offers.</p>
    <p>If you have any questions or feedback, feel free to reply to this email. We'd love to hear from you!</p>
    <p>Best regards,<br> 10K Plus Savings Challange Team</p>
  </div>
</body>
  </html>`;
};
