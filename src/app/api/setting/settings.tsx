import { readFileSync, writeFileSync} from 'node:fs';
import logging from '../../utils/logger';
import path from 'node:path';


export class Setting {
    static SETTING_PATH = process.env["SETTING_PATH"] ?? "./config/setting.json"
    static loadFromFile() {
        logging.debug("Loading setting: ", path.resolve(this.SETTING_PATH))
        try {

            const file = readFileSync(Setting.SETTING_PATH, {
                encoding: "utf-8"
            })
            return [true, JSON.parse(file)]
        } catch (error: any) {
            // logging.debug(error.name)
            // logging.debug(error.code)
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

    static saveToFile(newSettingStr: string) {
        const oldSetting = Setting.loadFromFile()
        const oldSettingStr= JSON.stringify(oldSetting)
        // const setting = JSON.stringify(this._setting)
        if (oldSettingStr === newSettingStr) {
            logging.warn("No change in setting detected")
            logging.warn("Original setting", oldSetting)
            logging.warn("Current setting", newSettingStr)
        }

        try {
            writeFileSync(this.SETTING_PATH, newSettingStr, {
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