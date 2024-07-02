export const eventNotificationEmail = (name: []) => {
  console.log("inside event notification", name);
  return ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Weekly Reminder</title>
    </head>
    <body>
      <p>Hi 10K Savings challenger,</p>
      <p>YOU MIGHT BE INTERESTED IN THIS!</p>
      <p>Admin just created a new event. <a href="http://localhost:5173/community">Click here</a>to check the event</p>
      <p>Peace, Love and Harmony,</p>
      <p>10KSC Admin Team</p>
    </body>
    </html>
    `;
};
