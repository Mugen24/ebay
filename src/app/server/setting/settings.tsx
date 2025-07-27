import { SettingType, Theme } from '@/app/types/SettingType';
import { Database } from 'sqlite';
import { assert } from 'node:console';


export class Setting {
    static SETTING_PATH = process.env["SETTING_PATH"] ?? "./config/setting.json"
    static DEFAULTS: SettingType = {
        theme: "dark",
        watchedItems: {},
        shippingLocation: "AU",
        shippingPostcode: 2100,
        itemLocation: "AU",
        marketPlaceId: "EBAY_AU",
        defaultRefreshIntervalSecond: 10 * 60,
    }
    setting: SettingType
    db: Database

    private constructor(database: Database) {
        this.db = database

        this.setting = Setting.DEFAULTS
    }

    async get_settings() {
        const setting: SettingType | undefined = await this.db.get(`
            select 
                theme,
                watchedItems,
                shippingLocation,
                shippingPostcode,
                itemLocation,
                marketPlaceId,
                defaultRefreshIntervalSecond
            from  
                setting
            where 
                -- TODO: handle individual user
                1 = 1
        `)

        this.setting = setting ? setting : Setting.DEFAULTS
    }

    async save(newSetting: SettingType) {
        this.setting = newSetting
        await this.db.run(`
            insert into setting values (:setting)
        `, this.setting)
    }

    static async init(database: Database) {
        const setting = new Setting(database)
        await setting.get_settings()
        return setting
    }
}

