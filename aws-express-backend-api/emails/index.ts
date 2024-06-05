import nodemailer from "nodemailer";

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
  email: string,
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
