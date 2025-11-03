import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Database } from "sqlite";
import { FavouriteItemType } from "../api/setting/watch/item/route";
import logging from "@/app/utils/logger";
type ID = string
export type FavouriteQueriesType = Record<ID, FavouriteQueryType>
export type FavouriteQueryType = {
    id: string
    ebaySearch: EbaySearch
}

export class Favourite {
    db: Database
    private constructor(database: Database) {
        this.db = database
    }

    async addQuery(data: EbaySearch) {
        const resp = await this.db.get(`
                insert into favouriteQueries 
                    (ebaySearch, lastCheckedEpoch) values (?, ?)
                returning id
            `, [JSON.stringify(data), Date.now()],
            // (err: any, row: any) => row.id
        )
        return resp
    }

    async removeQuery(id: string) {
        return await this.db.run(`
            delete from favouriteQueries 
                where
                    id = ? 
        `, [id])
    }

    async getQueries() {
        return await this.db.all(`
            select id, ebaySearch from favouriteQueries
        `).then((result) => {
            return result.map(x => {
                return {
                    id: x['id'],
                    ebaySearch: x['ebaySearch']
                }
            })
        })

    }

    async addItem(eID: string, data: string) {
        return await this.db.run(`
            insert into favouriteItems (id, data) values (?, ?) 
        `, [eID, data]) 
    }

    async removeItem(eID: string) {
        return await this.db.run(`
            delete from favouriteItems 
                where
                    id = ? 
        `, [eID])
    }

    async getItem(eID: string) {
        return await this.db.get(`
            select * from favouriteItems 
            where id = ?
        `, [eID])
    }

    async getItems(): Promise<FavouriteItemType[]> {
        const data = await this.db.all(`
            select id, data from favouriteItems 
        `)

        return data.map(item => {
            return {
                id: item["id"],
                ebayItem: JSON.parse(item["data"])
            }
        })
    }
    static async init(database: Database) {
        // const queries = await Favourite.getQueries(database)
        logging.info("Getting Favourite from DB")
        return new Favourite(database)
    }
}
