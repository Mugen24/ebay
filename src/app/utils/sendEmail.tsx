'use server'
import { MessageHeaders, SMTPClient } from "emailjs"
import logging from "./logger"

export async function sendEmail(subject: string, content: string) {
    logging.debug("Sending email")
    const smtpClient = new SMTPClient({
        user: process.env.EMAIL_USERNAME,
        password: process.env.APP_PASSWORD,
        host: "smtp.gmail.com",
        ssl: true
    })


    const header: Partial<MessageHeaders> = {
        from: process.env.EMAIL_USERNAME!,
        to: process.env.EMAIL_TO_LIST!,
        subject: "Ebay notification",
    }
    header["content-type"] = "text/html"

    header.text = content

    smtpClient.send(header, () => {})
}