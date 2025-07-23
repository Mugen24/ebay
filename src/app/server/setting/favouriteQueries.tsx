import { EbaySearch } from "@/app/types/EbayApiTypes/ebaySeachTypes";
import { Database } from "sqlite";
type ID = string
export type FavouriteQueriesType = Record<ID, FavouriteQueryType>
export type FavouriteQueryType = {
    id: string
    ebaySearch: EbaySearch
}

export class FavouriteQueries {
    favouriteQueries: Array<FavouriteQueryType>
    db: Database
    private constructor(database: Database, favouriteQueries: Array<FavouriteQueryType>) {
        this.favouriteQueries = favouriteQueries
        this.db = database
    }

    async add(data: FavouriteQueries) {
        return await this.db.run(`
            insert into favouriteQueries (ebaySearch) values (?)
        `, [data])
    }

    async remove (id: string) {
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

    static async init(database: Database) {
        const queries = await FavouriteQueries.getQueries(database)
        return new FavouriteQueries(database, queries)
    }
}