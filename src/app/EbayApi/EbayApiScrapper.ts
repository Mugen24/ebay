import puppeteer, { CookieParam, Browser, Page, EvaluateFunc, Keyboard, Session } from 'puppeteer';
import {writeFile, writeFileSync, readFileSync} from 'fs';
import { SessionError, SessionManager } from './SessionManager';
import { conditionIds, ProductSearchOptions, RequiredProductSearchOptions } from '../types/EbayScraperTypes/ProductSearchOptions';
import { headers } from 'next/headers';
import { webpack } from 'next/dist/compiled/webpack/webpack';
import { EbayItemSummary } from '../types/EbayScraperTypes/ScraperTypes';

export class EbayScraper {
    session: SessionManager

    constructor(session: SessionManager) {
        this.session = session
    }

    static authenticate(): EbayScraper | SessionError {
        const sessionResp = SessionManager.createSession()
        if (sessionResp.status === "ok") {
            return new EbayScraper(sessionResp.payload)
        } else {
            return sessionResp
        }
    }

    /*
    protected async loadEbayCookie() {
        const browser = this.browser;
        const cookies = JSON.parse(readFileSync(process.env.TOKEN_PATH, {encoding: "utf-8"}))
        for (let cookie of cookies) {
            // console.log(cookie)
            browser.connection.send("storage.setCookie", {
                "cookie": cookie 
            })
        }
        // console.log(cookies[0])
        // browser.connection.send("storage.setCookie", {
        //     "cookie": cookies[0]
        // })
    }
    protected async saveEbayCookies() {
        const browser = this.browser;
        const {type, id, result} = await browser.connection.send("storage.getCookies", {
        filter: {
            domain: ".ebay.com.au"
            // httpOnly: true
        }
        })
        if (type === "success") {
        // result["cookies"].map(cookie => {
        //     cookie["value"] = cookie["value"]["value"]
        // })
        writeFile(process.env.TOKEN_PATH, JSON.stringify(result["cookies"]), (e) => {console.log(e)})
        }

    }
    */


    // Searches for ebay lowest sold item using
    // Ebay product search
    // **NOTE** Only work with account that has been granted product search
    // priviledge
    // TODO: write function to enable product search in case it hasn't been 
    // enabled for account
    // TODO: maybe just construct the url
    // https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726972156419&startDate=1632364156419&categoryId=0&offset=0&limit=50&sorting=avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
    // https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726974855720&startDate=1632366855720&categoryId=0&conditionId=3000&minPrice=100&offset=0&limit=50&sorting=-avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
    async searchLowestSoldBetter(options: ProductSearchOptions): Promise<EbayItemSummary> {
        const BASEURL = "https://www.ebay.com.au/sh/research"

        const header = this.session.getSessionHeader()
        const today = new Date()
        today.setUTCFullYear(today.getUTCFullYear() + 3)

        //Sets the default value
        const requiredOption: RequiredProductSearchOptions = {
            keywords: options.keywords,

            tz: options.tz ?? "Australia Sydney",
            sorting: options.sorting ?? "-avgsalesprice",
            offset: options.offset ?? 0,
            dayRange: 3 * 365, //Max 3 years
            startDate: Date.now(),
            endDate: today.valueOf(),
            tabName: "SOLD",
            categoryId: 0,
            conditionId: conditionIds.USED,
            marketplace: "EBAY-AU",
            modules: "searchResults"
        }
        //This is 1 because the 0 position is reserved for error status
        //Change this if you decides to add more modules
        const modulesPosition = 1



        const stringOption: Record<string, string> = {}
        for (const [key, value] of Object.entries(requiredOption)) {
            stringOption[key] = value.toString()
        }

        const searchParams = new URLSearchParams(stringOption)

        const resp = await fetch(`${BASEURL}?${searchParams.toString()}`, {
            headers: header,
            method: "GET"
        })

        const rawInfos: string = await resp.text()
        const rawItemsResults = rawInfos.split(/\n{2}/)
        const itemEntries = JSON.parse(rawItemsResults[modulesPosition].trim())
                            .results
                            .map((entry: any) => {
                                return {
                                    "title": entry.listing.title.textSpans[0]?.text,
                                    "image": "https:" + entry.listing.image.URL,
                                    "price": entry.avgsaleprice.avgsaleprice.textSpans[0]?.text,
                                    "date": entry.datelastsold.textSpans[0]?.text
                                }
                            })

        return itemEntries
    }

    async bidAuction(itemLink: string, biddingPrice: number) {
        //TODO
    }
}

// (async () => {
//     const ebayScrapper = await EbayScraper.authenticate();
//     await ebayScrapper.searchLowestSoldBetter("steam deck", 100)
// })()
