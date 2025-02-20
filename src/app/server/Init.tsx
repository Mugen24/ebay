import logging from "../utils/logger";
import { setting } from "./setting/settings";
import { categoriesManager } from "./setting/categoryManager";
// import { EmailNotificationListener } from "./EmailNotificationClient";

export async function serverInit() {
    logging.group("Server started")

    // const listener = getSearchListener()
    // const email = new EmailNotificationListener()
    // listener.listeners.push(email.notifyListener)
    // listener.start()

    // setTimeout(() => listener.stop(), 3000)
    logging.groupEnd()
}


