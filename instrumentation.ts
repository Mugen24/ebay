import { EmailNotificationListener } from './src/app/server/EmailNotificationClient';
import { getSearchListener } from "./src/app/server/SearchListener";
export function register() {
    console.log("registering")
    const listener = getSearchListener()
    const email = new EmailNotificationListener()
    listener.listeners.push(email.notifyListener)
}