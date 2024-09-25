export const reminderEmail = (name: string) => {
  return ` <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weekly Reminder</title>
  </head>
  <body>
    <p>Hi 10K Savings ${name},</p>
    <p>TO SUPPORT YOUR EFFORTS OF HITTING YOUR SAVINGS GOAL BY END-OF-YEAR, WE PROMISED TO HOLD YOU ACCOUNTABLE TO YOUR SWOT ANALYSIS ACTION ITEMS LIST.</p>
    <p>So, here is your weekly reminder to check OFF something on your list. Click <a href="${process.env.RETURN_CLIENT_URL}/swotportal/tasklist">this link</a> to review your list and due dates. Once you have completed a task, please check it off of the list.</p>
    <p>If you need assistance, please head over to the SWOT Task List post under the community dashboard OR schedule a 1:1 Savings Strategy Session with one of our expert savings coaches. One of the admins or community members will answer your question(s). We invite you to lean on your 10K Savings Challengers Community. We are here for you!</p>
    <p>Peace, Love and Harmony,</p>
    <p>10KSC Admin Team</p>
  </body>
  </html>
  `;
};
