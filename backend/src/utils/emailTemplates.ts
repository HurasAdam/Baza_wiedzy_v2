export const getPasswordResetTemplate = (url: string) => ({
    subject: "🔐Resetowanie hasła - Baza Wiedzy",
    text: `Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Bazie Wiedzy. Kliknij w poniższy link, aby ustawić nowe hasło: ${url}`,
    html: `<!DOCTYPE html>
  <html lang="pl">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resetowanie Hasła</title>
<style>
    body { background: #f9fafb; font-family: 'Inter', sans-serif; margin: 0; padding: 0; color: #111; }
    .container { max-width: 480px; margin: 50px auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center; }
    .logo { margin-bottom: 24px; }
    .header { font-size: 24px; font-weight: 600; color: #1e1e1e; margin-bottom: 16px; }
    .content { font-size: 14px; color: #4a4a4a; line-height: 1.6; margin-bottom: 24px; }

    a { text-decoration: none; color: #fff;  }

    /* Przycisk z białym tekstem */
    .button { 
        display: inline-block; 
        padding: 12px 24px; 
        font-size: 14px; 
        color: #fff; 
        background: #6366f1; 
        text-decoration: none; 
        border-radius: 8px; 
        font-weight: 500; 
        transition: background 0.3s ease-in-out; 
        box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3); 
    }

    .button:hover { 
        background: #4f46e5; 
        color: #fff;  /* Biały kolor tekstu na hover */
    }

    .footer { font-size: 12px; color: #6b7280; margin-top: 24px; }
    .icon { width: 48px; margin-bottom: 16px; }
</style>
  </head>
  <body>
      <div class="container">
          <img src="https://yourcompany.com/logo.png" alt="Baza Wiedzy" class="logo" width="120">
          <img src="https://img.icons8.com/ios-filled/50/6366f1/password.png" alt="Reset Icon" class="icon">
          <h1 class="header">Resetowanie hasła</h1>
          <p class="content">Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w Bazie Wiedzy. Kliknij w poniższy przycisk, aby ustawić nowe hasło.</p>
          <a href="${url}" class="button">Zresetuj hasło</a>
          <p class="content">Jeśli nie prosiłeś o resetowanie hasła, zignoruj tę wiadomość.</p>
          <p class="footer">&copy; ${new Date().getFullYear()} Baza Wiedzy. Wszelkie prawa zastrzeżone.</p>
      </div>
  </body>
  </html>`,
});
export const getVerifyEmailTemplate = (url: string) => ({
    subject: "Verify Email Address",
    text: `Click on the link to verify your email address: ${url}`,
    html: `<!doctype html><html lang="en-US"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><title>Verify Email Address Email Template</title><meta name="description" content="Verify Email Address Email Template."><style type="text/css">a:hover{text-decoration:underline!important}</style></head><body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0"><!--100%body table--><table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;"><tr><td><table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0"><tr><td style="height:80px;">&nbsp;</td></tr><tr><td style="text-align:center;"></a></td></tr><tr><td style="height:20px;">&nbsp;</td></tr><tr><td><table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);"><tr><td style="height:40px;">&nbsp;</td></tr><tr><td style="padding:0 35px;"><h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Please verify your email address</h1><span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Click on the following link to verify your email address.</p><a target="_blank" href="${url}" style="background:#2f89ff;text-decoration:none !important; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email Address</a></td></tr><tr><td style="height:40px;">&nbsp;</td></tr></table></td><tr><td style="height:20px;">&nbsp;</td></tr><tr><td style="text-align:center;"><p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy;</p></td></tr><tr><td style="height:80px;">&nbsp;</td></tr></table></td></tr></table><!--/100%body table--></body></html>`,
});
