import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });



    async sendResetPasswordEmail(email:string, token:string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_RESET_URL}?token=${token}`;

        await this.transporter.sendMail({
            to:email,
            subject:'Renitilisation du mot de passe',
            html: `<p>Cliquez <a href="${resetUrl}">ici</a> pour réinitialiser votre mot de passe.</p>`,
        });
    }
}