import { EmailNotificationListener } from './src/app/server_components/EmailNotificationClient';
import { getSearchListener } from "./src/app/server_components/SearchListener";
export function register() {
    console.log("registering")
    const listener = getSearchListener()
    const email = new EmailNotificationListener()
    listener.listeners.push(email.notifyListener)
}