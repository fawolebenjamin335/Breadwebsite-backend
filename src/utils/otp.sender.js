import nodemailer from "nodemailer";
import { config } from "../config/env.js";

export const sendOTPEmail = async (to, subject, message) => {
    
  const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
  user: config.users,
  pass: config.pass,
}         

  });

  const mailOptions = {
    from: config.users,
    to,
    subject,
    text: message,
  };

 return transporter.sendMail(mailOptions);
}

