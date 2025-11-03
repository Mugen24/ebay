import logging from "@/app/utils/logger";

export class StreamListener {
    stream: TransformStream<any, any>;
    encoder: TextEncoder;
    writer: WritableStreamDefaultWriter<any>;
    apiBody: any
    update: (...args: any) => Promise<boolean>
    constructor() {
        this.stream = new TransformStream()
        this.encoder = new TextEncoder()
        this.writer = this.stream.writable.getWriter()
        this.apiBody = this.stream.readable

        this.update = this._update.bind(this)
    }

    async _update(data: any): Promise<boolean>{
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
