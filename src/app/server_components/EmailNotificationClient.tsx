import { getSearchListener, SearchConfigDataType } from "./SearchListener";
import { SMTPClient } from "emailjs";
import { Message } from "emailjs";
import { MessageHeaders } from "emailjs";
import { ItemSummary } from "../types/EbayApiTypes/ebaySeachTypes";

export class EmailNotificationListener {
    smtpClient: SMTPClient
    constructor() {
        console.info("Email notification Listener constructed")
        this.smtpClient = new SMTPClient({
            user: process.env.EMAIL_USERNAME,
            password: process.env.APP_PASSWORD,
            host: "smtp.gmail.com",
            ssl: true
        })
        this.notifyListener.bind(this)
    }

    notifyListener(data: SearchConfigDataType) {
        console.info("New email sent")
        // console.debug(data)
        const header: Partial<MessageHeaders> = {
            from: process.env.EMAIL_USERNAME!,
            to: process.env.EMAIL_TO_LIST!,
            subject: "Ebay notification",
        }

        header.text = "<http>"
        for (const [searchTerm, itemSummaries] of Object.entries(data)) {
            header.text = header.text + `
                <div>
                    <p>${searchTerm}</p>
                    ${itemSummaries.map((itemSummary: ItemSummary) => {
                        return `
                            <div>
                                <p>${itemSummary.title}</p>
                                <p>${itemSummary.shortDescription}</p>
                                <img src=${itemSummary.thumbnailImages}>
                            </div>
                        `
                    })}
                </div>
            `
        }
        header.text = "</http>"

        const message: Message = new Message(header)
        // new SMTPClient({
        //     user: process.env.EMAIL_USERNAME,
        //     password: process.env.APP_PASSWORD,
        //     host: "smtp.gmail.com",
        //     ssl: true
        // }).send(
        //     {
        //         text: 'i hope this works',
        //         from: 'testbenchonly.book@gmail.com',
        //         to: 'john.nguyen1022@gmail.com',
        //         cc: 'else <else@your-email.com>',
        //         subject: 'testing emailjs',
        //     },
        //     (err: any, message: any) => {
        //         console.log(err || message);
        //     }
        // )
        this.smtpClient.send(message, (err: any, message: any) => {
                console.log(err || message)
            }
        )
        
    }

}
