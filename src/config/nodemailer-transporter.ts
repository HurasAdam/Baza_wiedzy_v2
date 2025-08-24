import nodemailer from "nodemailer";
import { EMAIL_SENDER, EMAIL_SENDER_PASSWORD, EMAIL_SERVICE, EMAIL_SERVICE_HOST } from "../constants/env";

export const createTransporter = () =>
    nodemailer.createTransport({
        service: EMAIL_SERVICE,
        host: EMAIL_SERVICE_HOST,
        auth: {
            user: EMAIL_SENDER as string,
            pass: EMAIL_SENDER_PASSWORD as string,
        },
    });
