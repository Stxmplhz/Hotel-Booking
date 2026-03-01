import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        }
    });

    const mailOptions = {
        from: '"Stayly Support" <no-reply@stayly.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};