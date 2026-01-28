import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', //'smtp.gmail.com'
  auth: {
    user: process.env.SENDER_EMAIL, 
    pass: process.env.APP_PASSWORD 
  }
});

export default transporter;