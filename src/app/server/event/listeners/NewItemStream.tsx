import logging from "@/app/utils/logger";
import { NewItemFormat, NewItemSubscriber } from "../NewItemEvent";

export class NewItemStream implements NewItemSubscriber {
    stream: TransformStream<any, any>;
    encoder: TextEncoder;
    writer: WritableStreamDefaultWriter<any>;
    apiBody: any
    constructor() {
        this.stream = new TransformStream()
        this.encoder = new TextEncoder()
        this.writer = this.stream.writable.getWriter()
        this.apiBody = this.stream.readable 
    }

    async update(data: NewItemFormat): Promise<boolean>{
        console.log("New Item")
        try {
            this.writer.write(this.encoder.encode(`data: ${JSON.stringify(data)}`))
            this.writer.write(this.encoder.encode(`\n\n`))
            return true
        } 
        catch(e) {
            logging.error(JSON.stringify(e))
            return false
        }

    }
}
