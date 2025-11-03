'use server'
import { MessageHeaders, SMTPClient } from "emailjs"
import logging from "./logger"
import type { ReactNode } from "react"

export async function sendEmail(subject: string, content: string) {
    // logging.debug("Sending email")
    // logging.debug(`Username: ${process.env.EMAIL_USERNAME}`)
    // logging.debug(`ToList: ${process.env.EMAIL_TO_LIST}`)
    // logging.debug("Sending email")
    const smtpClient = new SMTPClient({
        user: process.env.EMAIL_USERNAME,
        password: process.env.APP_PASSWORD,
        host: "smtp.gmail.com",
        ssl: true
    })

    const message: MessageHeaders = {
        from: process.env.EMAIL_USERNAME!,
        to: process.env.EMAIL_TO_LIST!,
        subject: subject,
        "content-type": "text/html",
        text: content
    }

    let outcome = false
    smtpClient.send(message, (err, msg) => {
        if (err) {
            logging.error(`Email error: ${err} \n ${JSON.stringify(msg)}`)
        }
        outcome = true
    })

    return outcome
}


export async function reactComponentToString(component: ReactNode) {
    const reactServer = (await import("react-dom/server")).default
    return reactServer.renderToStaticMarkup(component)
}
