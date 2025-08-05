import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Database } from "sqlite";
type ID = string
export type FavouriteQueriesType = Record<ID, FavouriteQueryType>
export type FavouriteQueryType = {
    id: string
    ebaySearch: EbaySearch
}

export class Favourite {
    favouriteQueries: Array<FavouriteQueryType>
    db: Database
    private constructor(database: Database, favouriteQueries: Array<FavouriteQueryType>) {
        this.favouriteQueries = favouriteQueries
        this.db = database
    }

    async addQuery(data: Favourite) {
        return await this.db.run(`
            insert or ignore into favouriteQueries (ebaySearch) values (?)
        `, [data])
    }

    async removeQuery(id: string) {
        return await this.db.run(`
            delete from favouriteQueries 
                where
                    id = ? 
        `, [id])
    }

    static async getQueries(database: Database) {
        return await database.all(`
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

    async addItem(eId: string) {
        return await this.db.run(`
            insert or ignore into favouriteItems (id) values (?)
        `, [eId]) 
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
            select id from favouriteItems 
            where id = ?
        `, [eID])
    }

    async getItems() {
        return await this.db.all(`
            select id from favouriteItems 
        `)
    }
    static async init(database: Database) {
        const queries = await Favourite.getQueries(database)
        return new Favourite(database, queries)
    }
}