import { ItemSummary } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Button } from "@/components/ui/button";
import { NewItemEvent } from "./NewItemEvent";
import { sendEmail } from "@/app/utils/sendEmail";
import { SendEmailSubscriber } from "./listeners/MailListener";
import { NewItemStream } from './listeners/NewItemStream';
import logging from "@/app/utils/logger";

logging.debug("Event module: started")
// Listeners
const email = new SendEmailSubscriber()

// need to expose the instance for an API endpoint
export const newItemStream = new NewItemStream()

// Events
const newItemEvent = new NewItemEvent()
newItemEvent.addListener(email)
newItemEvent.addListener(newItemStream)

newItemEvent.startLoop()
