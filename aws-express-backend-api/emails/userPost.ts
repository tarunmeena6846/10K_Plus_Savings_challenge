export const getUserPostNotificationTemp = (
  name: string,
  title: string,
  postId: string
) => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notification of Community Group Post</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .content {
          padding: 20px;
        }
        .content p {
          margin: 0 0 15px;
        }
        .content a {
          color: #3498db;
          text-decoration: none;
        }
        .content a:hover {
          text-decoration: underline;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="content">
          <p>Hi 10K Savings Challenger,</p>
          <p>YOU MIGHT BE INTERESTED IN THIS!</p>
          <p>${name}, just posted <b>${title}</b> to your community dashboard. Click <a href="${process.env.RETURN_CLIENT_URL}/community/post/${postId}">here</a> to read it.</p>
          <p>Best regards,<br>10K Plus Savings Challenge Team</p>
        </div>
      </div>
    </body>
    </html>`;
};
