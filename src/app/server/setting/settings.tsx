import { readFileSync, writeFileSync} from 'node:fs';
import logging from '../../utils/logger';
import path from 'node:path';
import { Outcome } from '@/app/types/Outcome';
import { FavouriteQueries, SettingType, Theme } from '@/app/types/SettingType';


class Setting {
    static SETTING_PATH = process.env["SETTING_PATH"] ?? "./config/setting.json"
    static DEFAULTS: SettingType = {
        theme: "dark",
        favouriteQueries: {},
        watchedItems: {},
        shippingLocation: "AU",
        shippingPostcode: 2100,
        itemLocation: "AU",
        marketPlaceId: "EBAY_AU",
        defaultRefreshIntervalSecond: 10 * 60,
    }
    setting: SettingType

    constructor() {
        const [outcome, setting] = this.loadFromFile()
        if (outcome) {
            this.setting = Object.assign(Setting.DEFAULTS, setting)
        } else {
            throw new Error("Can't fetch setting")
        }
    }

    loadFromFile(): Outcome<SettingType | {}> {
        logging.debug("Loading setting: ", path.resolve(Setting.SETTING_PATH))
        try {

            const file = readFileSync(Setting.SETTING_PATH, {
                encoding: "utf-8"
            })

            const jFile: SettingType = JSON.parse(file)
            return [true, jFile]

        } catch (error: any) {
            if (error.code === "ENOENT") {
                logging.error("./config/setting.json does not exist at path. Creating file")
                writeFileSync(Setting.SETTING_PATH, "{}", {encoding: "utf8"})
                return [true, {}]
            } else {
                logging.error("Setting error: ", error)
            }
            return [false, error]
        }
    }

    saveToFile(newSettingStr: string): Outcome<any> {
        const oldSetting = this.loadFromFile()
        const oldSettingStr= JSON.stringify(oldSetting)
        // const setting = JSON.stringify(this._setting)
        if (oldSettingStr === newSettingStr) {
            logging.warn("No change in setting detected")
            logging.warn("Original setting", oldSetting)
            logging.warn("Current setting", newSettingStr)
        }

        try {
            writeFileSync(Setting.SETTING_PATH, newSettingStr, {
                encoding: "utf8",
                flag: "w+"
            })
        } 
        catch (error) {
            logging.error("Unable to write setting: ", error)
            return [false, error]
        }
        finally {
            return [true, ""]
        }


    }

}

export const setting = new Setting()
