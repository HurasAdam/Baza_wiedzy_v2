import resend from '../config/resend.js';
import { EMAIL_SENDER, NODE_ENV } from '../constants/index.js';
import type { IParams } from '../types/index.js';

const getFromEmail = (): string => (NODE_ENV === 'development' ? 'onboarding@resend.dev' : EMAIL_SENDER);

const getToEmail = (to: string): string => (NODE_ENV === 'development' ? 'delivered@resend.dev' : to);

/**
 * SendMail.
 * @param root0
 * @param root0.to
 * @param root0.subject
 * @param root0.text
 * @param root0.html
 */
export default async ({ to, subject, text, html }: IParams): Promise<void> => {
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });
};
