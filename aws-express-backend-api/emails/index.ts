import nodemailer from "nodemailer";
import corn from "node-cron";
import { weeklyPortalReminder } from "./weeklyPortalUpdateReminder";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_ADMIN_EMAIL,
    pass: process.env.NODEMAILER_ADMIN_PASS,
  },
});
export const sendEmail = async (
  email: [] | string,
  subject: string,
  html: string
) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_ADMIN_EMAIL,
      to: email,
      subject,
      html,
    };
    // await transporter.sendMail(mailOptions);
    console.log("send email", email, typeof email);

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const scheduleWeeklyReminderEmail = async (email: [] | string) => {
  corn.schedule("* * * * *", async (params: any) => {
    console.log("weekly schedular called");

    sendEmail(
      "tarunmeena6846@gmail.com",
      "10K SAVINGS CHALLENGE: Task List Reminder ",
      weeklyPortalReminder("tarun")
    );

    // await sendEmail();
  });
};

scheduleWeeklyReminderEmail([]);
