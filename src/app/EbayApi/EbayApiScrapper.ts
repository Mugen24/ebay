import puppeteer, { CookieParam, Browser, Page, EvaluateFunc, Keyboard } from 'puppeteer';
import {writeFile, writeFileSync, readFileSync} from 'node:fs';


const LOGIN_LINK_SELECTOR = "#gh-ug > a:nth-child(1)";

const USER_NAME_SELECTOR = "#userid";
const USER_ENTER_SELECTOR = "#signin-continue-btn";

const PASSWORD_SELECTOR = '#pass';
const PASSWORD_ENTER_SELECTOR = '#sgnBt';

const SEARCH_BAR_SELECTOR = '#gh-ac';
const SEARCH_BAR_ENTER_SELECTOR = '#gh-btn';

const AUSTRALIA_ONLY_OPTION_SELECTOR = '#x-refine__group__6 > ul:nth-child(1) > li:nth-child(3) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(1) > input:nth-child(1)';
const SOLD_ITEM_OPTION_SELECTOR = '#x-refine__group__8 > ul:nth-child(1) > li:nth-child(5) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1) > span:nth-child(1) > input:nth-child(1)'

const ITEM_CONDITION_SELECTOR = 'button::-p-text(Condition)'
const ITEM_CONDITION_USED_SELECTOR = 'li::-p-text(Used)'

const SORT_SELECTOR = 'button::-p-text(Sort: Ended recently)';
const SORT_LOWEST_SELECTOR = 'li::-p-text(Price + postage: lowest first)'

const BID_ENTER_SELECTOR = 'button::-p-text(Place bid)'
const BID_PRICE_INPUT_SELECTOR = '.app-input-price__action_els input.textbox__control'
const BID_PRICE_ENTER_SELECTOR = '.place-bid-actions__submit button'
// ms
const keyboardDelay = 100

async function sleepms(time: number) {
  return await new Promise((res, rej) => {
    return setTimeout(res, time)
  }) 
}

export type EbayItemSummary = {
  title: String | undefined | null,
  image: String | undefined | null, 
  price: String | undefined | null,
  date: String | undefined | null
}
export class EbayScraper {
    browser: Browser
    protected constructor(browser: Browser) {
        this.browser = browser
    }

    static async authenticate() {
        const browser = await puppeteer.launch({
            browser: "firefox",
            executablePath: process.env.FIREFOX_PATH,
            headless: false,
            // protocol: "webDriverBiDi",
            extraPrefsFirefox: {
            "devtools.chrome.enabled": true,
            "devtools.debugger.prompt-connection": false,
            "devtools.debugger.remote-enabled": true,
            },
            // args: ["--remote-debugging-port=9222"],
            // args: ["-start-debugger-server=ws:9222"],
            pipe: false,
            defaultViewport: {
            "width": 1200,
            "height": 1440
            }
        });
        const ebayScrapper = new EbayScraper(browser);
        await ebayScrapper.login()
        return ebayScrapper
    }

    protected async loadEbayCookie() {
        const browser = this.browser;
        const cookies = JSON.parse(readFileSync(process.env.TOKEN_PATH, {encoding: "utf-8"}))
        console.log(cookies)
        for (let cookie of cookies) {
            console.log(cookie)
            browser.connection.send("storage.setCookie", {
            cookie: cookie 
            })
        }
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
        result["cookies"].map(cookie => {
            cookie["value"] = cookie["value"]["value"]
        })
        writeFile(process.env.TOKEN_PATH, result["cookies"], (e) => {console.log(e)})
        }

    }
    // Function should be used in as param for
    // page.waitForFunction
    private async isEbayLoggedIn () {
        if (document.readyState === "complete") {
            // Check if username is present
            if (document.querySelector("#gh-ug > b:nth-child(1)") !== null) {
            if (document.cookie) {
                await new Promise((resolve, reject) => {
                setTimeout(resolve, 3000)
                })
                return true
            }
            } 
        }
        return false
    }


    async login(retry = 3, _page?: Page) {
        const browser = this.browser;
        // Navigate the page to a URL
        const page = _page ?? await browser.newPage();

        if (retry <= 0) {
            page.close()
            throw new Error("Failed to login")
        } 

        try {
            this.loadEbayCookie()
            await new Promise((res, rej) => {
            return setTimeout(res, 3000)
            })
            await page.goto(process.env.EBAY_URL);
            await page.waitForFunction(this.isEbayLoggedIn, {
            "timeout": 5000
            })

        } catch (error){
            console.log(error)

            await page.goto(process.env.EBAY_URL);
            await page.locator(LOGIN_LINK_SELECTOR).click();

            await page.locator(USER_NAME_SELECTOR).click()
            await page.keyboard.type(process.env.EBAY_USERNAME, {delay: 100});
            await page.click(USER_ENTER_SELECTOR);
            // TODO: Handle wrong username, page doesn't change

            await page.locator(PASSWORD_SELECTOR).click();
            await page.keyboard.type(process.env.EBAY_PASSWORD, {delay: 100});
            await page.click(PASSWORD_ENTER_SELECTOR);
            await page.waitForNavigation({waitUntil: "networkidle2"});
            await this.saveEbayCookies()

            this.login(retry - 1)
        } 
    }
    async _searchLowestSold(searchTerm: string, browser: Browser, page: Page) {
        await page.locator(SEARCH_BAR_SELECTOR).click()
        await page.keyboard.type(searchTerm, {delay: keyboardDelay})
        await page.locator(SEARCH_BAR_ENTER_SELECTOR).click()

        await page.locator(SOLD_ITEM_OPTION_SELECTOR).click()
        await sleepms(3000)

        await page.locator(ITEM_CONDITION_SELECTOR).click()
        await page.locator(ITEM_CONDITION_USED_SELECTOR).click()
        await sleepms(3000)

        await page.locator(SORT_SELECTOR).click()
        await page.locator(SORT_LOWEST_SELECTOR).click()
        await sleepms(3000)

        await page.locator(AUSTRALIA_ONLY_OPTION_SELECTOR).click()
        await sleepms(3000)

        const ebayItemSummary: EbayItemSummary[]= await page.$$eval('.s-item.s-item__pl-on-bottom', (nodeArrays) => {
            try {
            const ebayItemSummary: EbayItemSummary[] = [];
            nodeArrays.forEach((node) => {
                const container = node.querySelector(".s-item__wrapper.clearfix")
                if (!container) {
                    return
                }

                const imageInfo = container.querySelector('.s-item__image-section')
                const image = imageInfo?.querySelector('img')?.src

                const itemInfo = container.querySelector('.s-item__info.clearfix')
                const title = itemInfo?.querySelector('.s-item__title')?.textContent
                const price = itemInfo?.querySelector('.s-item__price')?.textContent
                const date = itemInfo?.querySelector('.s-item__caption')?.textContent

                if (!price || !date) return
                ebayItemSummary.push({
                    "title": title as string,
                    "price": price,
                    "date": date,
                    "image": image as string
                })

            });

            return ebayItemSummary;
            } catch(e) {
            return e
            }
        })
        return ebayItemSummary
    }

    // Searches for ebay lowest sold item using
    // Ebay product search
    // **NOTE** Only work with account that has been granted product search
    // priviledge
    // TODO: write function to enable product search in case it hasn't been 
    // enabled for account
    // TODO: maybe just construct the url
    // https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726972156419&startDate=1632364156419&categoryId=0&offset=0&limit=50&sorting=avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
    // https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1726974855720&startDate=1632366855720&categoryId=0&conditionId=3000&minPrice=100&offset=0&limit=50&sorting=-avgsalesprice&tabName=SOLD&tz=Australia%2FSydney
    async searchLowestSoldBetter(searchTerm: string, minPrice: number = 0) {
        const browser = this.browser
        const page = await browser.newPage()
        enum conditionId {
            used = "3000"
        }

        const threeYearsToDays = 1095;

        const epochDate = new Date().getTime();
        const threeYears = new Date();
        threeYears.setFullYear(threeYears.getFullYear() - 3);
        const threeYearsEpoch = threeYears.getTime();


        const searchParams = new URLSearchParams({
            "marketPlace": "EBAY-AU",
            "keywords": searchTerm,
            "categoryId": "0",
            "conditionId": conditionId.used,
            "sorting": "avgsalesprice",
            "minPrice": minPrice.toString(),
            "dayRange": threeYearsToDays.toString(),
            "startDate": threeYearsEpoch.toString(),
            "endDate": epochDate.toString(),
            "tz": "Australia/Sydney"
        })
        const url = new URL("https://www.ebay.com.au/sh/research?"+searchParams.toString())

        console.log(url.toString())
        await page.goto(url.toString());
        const ebayItemSummaries: EbayItemSummary[] = await page.$$eval(".research-table-row", (nodeArrays) => {
            const ebayItemSummaries: EbayItemSummary[] = [];
            nodeArrays.forEach(item => {
                const image = (item.querySelector(".research-table-row__thumbnail img") as HTMLImageElement).src
                
                const title = item.querySelector(".research-table-row__product-info-name")?.textContent
                const priceContainer = item.querySelectorAll(".research-table-row__item-with-subtitle div")
                const price = priceContainer[0].textContent
                const method = priceContainer[1].textContent
                
                const date = item.querySelector(".research-table-row__item.research-table-row__dateLastSold")?.textContent
                
                // console.log(image)
                // console.log(title)
                // console.log(price)
                // console.log(method)
                // console.log(date)

                const ebayItemSummary: EbayItemSummary = {
                    "title": title,
                    "price": price,
                    "date" : date,
                    "image": image
                }
                ebayItemSummaries.push(ebayItemSummary)
            })
            return ebayItemSummaries
        })
        return ebayItemSummaries
    }

    async bidAuction(itemLink: string, biddingPrice: number) {
        const browser = this.browser;
        throw new Error("Function not yet completed")
        const page = await browser.newPage();
        await page.goto(itemLink);
        await page.locator(BID_ENTER_SELECTOR).click();
        sleepms(1000);
        await page.locator(BID_PRICE_INPUT_SELECTOR).click();
        await page.keyboard.type(biddingPrice.toString(), {delay: keyboardDelay});
        sleepms(300);
        await page.locator(BID_PRICE_ENTER_SELECTOR).click();
        page.close();
    }
}

(async () => {
    const ebayScrapper = await EbayScraper.authenticate();
    await ebayScrapper.searchLowestSoldBetter("steam deck", 100)
})()