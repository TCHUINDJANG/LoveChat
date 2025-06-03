// src/common/mailer/send-reset-mail.ts
import * as nodemailer from 'nodemailer';

export async function sendPasswordResetMail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER, // adresse gmail
      pass: process.env.SMTP_PASS, // mot de passe ou app password
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"FOREVER Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de mot de passe',
    html: `
      <p>Bonjour,</p>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien suivant pour le réinitialiser :</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Ce lien est valable pendant 15 minutes.</p>
    `,
  });
}
