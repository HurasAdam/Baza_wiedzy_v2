export interface IEmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface IParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}
