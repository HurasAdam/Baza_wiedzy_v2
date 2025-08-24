import { createTransporter } from "../config/nodemailer-transporter";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";
type Params = {
    to: string;
    subject: string;
    text: string;
    html: string;
};

const getFromEmail = () => (NODE_ENV === "development" ? EMAIL_SENDER : EMAIL_SENDER);
const getToEmail = (to: string) => (NODE_ENV === "development" ? to : to);

const transporter = createTransporter();

export const sendMail = async ({ to, subject, text, html }: Params) => {
    const mailOptions = {
        from: getFromEmail(),
        to: getToEmail(to),
        subject: subject,
        text: text,
        html: html,
    };
    return await transporter.sendMail(mailOptions);
};
