import logging from "../utils/logger";
import { getSearchListener } from "./SearchListener";
import { Setting } from "./setting/settings";
import { CategoryManager } from "./setting/categoryManager";
// import { EmailNotificationListener } from "./EmailNotificationClient";
export const setting = new Setting()
export let categoriesManager: CategoryManager;
categoriesManager = new CategoryManager(setting.setting.marketPlaceId!)

const isCatUpToDate = await categoriesManager.isCategoriesUptoDate()
if (!isCatUpToDate) {
    categoriesManager.updateCategories()
} else {
    categoriesManager.loadCategories()
}


export function ServerInit() {
    logging.group("Server started")
    const listener = getSearchListener()
    // const email = new EmailNotificationListener()
    // listener.listeners.push(email.notifyListener)
    listener.start()

    setTimeout(() => listener.stop(), 3000)
    logging.groupEnd()
}


