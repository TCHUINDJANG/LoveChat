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




    async sendActivationEmail(email: string , token: string):Promise<void> {
        const activateLink = `${process.env.FRONTEND_URL}/activate?token=${token}`;

        
        await this.transporter.sendMail({
            from:process.env.EMAIL_FROM,
            to: email,
            subject:'Activez votre compte',
            html:`<p>Cliquez <a href="${activateLink}">ici</a> pour activer votre compte.</p>`,
        });
    }
}