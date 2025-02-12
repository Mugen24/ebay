import { readFileSync, writeFileSync } from 'node:fs';
import logging from './logger';
import path from 'node:path';
import { EbaySearch } from '../types/EbayApiTypes/ebaySeachTypes';
import { SEbaySearch } from '../EbayApi/EbaySaverState';

export interface Favourite {
    // Required the parsed version of ebaySearch using EbaySaverState
    state: SEbaySearch,
    readEbayItemNumbers: number[],
    lastAccess: EpochTimeStamp
}

export interface SettingType {
    theme: "light" | "dark",
    favourites: Favourite
}

class Setting {
    static SETTING_PATH = process.env["SETTING_PATH"] ?? "./config/setting.txt"
    static loadFromFile() {
        try {
            const file = readFileSync(Setting.SETTING_PATH, {
                encoding: "utf-8"
            })
            return JSON.parse(file)
        } catch (error) {
            logging.error("Setting error: ", error)
            return {}
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
            return true
        }

        try {
            writeFileSync(this.SETTING_PATH, newSettingStr, {
                encoding: "utf8",
                flag: "w+"
            })
        } 
        catch (error) {
            logging.error("Unable to write setting: ", error)
        }

    }

}