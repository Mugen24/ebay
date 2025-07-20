import "dotenv/config"
import { Header } from "next/dist/lib/load-custom-routes";
import {writeFile, readFileSync} from 'node:fs';

const REQUIRED_COOKIES = [
    "cid",
    "__ssds",
    "__ssuzjsr3",
    "AMP_f93443b04c",
    "totp",
    "shs",
    "__deba",
    "__uzma",
    "__uzmb",
    "__uzmc",
    "__uzmd",
    "__uzme",
    "__uzmf",
    "utag_main__sn",
    "dp1",
    "nonsession",
    "ns1",
    "_fbp",
]


type Cookie = {
    name: string,
    value: string,
    expiry: EpochTimeStamp | null
}

type CookieOk = {
    status: "ok",
    payload: string
}

type CookieError = {
    status: "err",
    payload: string
}

class CookiesManager {
    constructor () {}

    readCookies(): Cookie[] {
        let text: string;
        text = readFileSync(process.env.TOKEN_PATH, {encoding: "utf-8"})
        if (text) {
            const cookies: Cookie[] = JSON.parse(text)
            return cookies
        } else {
            throw new Error("No Cookies found")
        }
    }


    // Write cookies to file
    async saveCookies(cookies: string){
        const headers = new Headers({
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-US,en;q=0.5",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
            "Referer": "https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1733815410957&startDate=1639207410957&categoryId=0&offset=0&limit=50&tabName=SOLD&tz=Australia%2FSydney",
            "Host": "www.ebay.com.au",
            "X-Requested-With": "XMLHttpRequest",
            "Expires": "Sat, 01 Jan 2000 00:00:00 GMT",
        })
        headers.set("Cookie", cookies)

        const request_str = "https://www.ebay.com.au/sh/research/api/search?marketplace=EBAY-AU&keywords=steam deck&dayRange=1095&endDate=1733815410957&startDate=1639207410957&categoryId=0&offset=0&limit=50&tabName=SOLD&tz=Australia/Sydney&modules=aggregates&modules=searchResults&modules=resultsHeader"
        const resp = await fetch(request_str, {
            method: "GET",
            headers: headers
        })
        console.assert(resp.status === 200)
        const respHeader = resp.headers

        const rawCookieExpiry = respHeader.getSetCookie()
        const parsedCookies: Cookie[] = []

        for (const cookie of rawCookieExpiry) {
            const info = cookie.split(";")
            // First value is always the key value pair
            const [key, value] = info[0].split("=")
            let expiryDate: number | null  = null

            for (const data of info.splice(1, info.length)) {
                const [key, value] = data.split("=")
                if (key === "Expiry") {
                    expiryDate = new Date(value).valueOf() / 1000
                    break
                }
            }

            if (expiryDate === null) {
                console.debug(`No expiry for cookie: ${key}=${value}`)
            }

            parsedCookies.push({
                name: key,
                value,
                expiry: expiryDate ?? null
            })

        }

        const text = JSON.stringify(parsedCookies, null, 4)
        writeFile(process.env.TOKEN_PATH, text, (e) => {console.log(e)})
    }



    getCookies(): CookieOk | CookieError {
        let isError = false
        let errorMessage = ""

        const cookies = this.readCookies()
        const currEpoch = new Date()
        currEpoch.setDate(currEpoch.getDate() + 7)
        
        const isExpired = Object.values(cookies).every(cookie => {
            if (REQUIRED_COOKIES.includes(cookie.name)) {
                //Date library counts epoch in milisecs 
                //Cookies tends to count in second
                if (cookie.expiry === null) {
                    console.trace()
                    throw Error("No expiry date found")
                }

                return (currEpoch.valueOf()/1000 < cookie.expiry)
            }
        })

        if (isExpired) {
            isError = true   
            errorMessage = `Cookies expired`
            console.warn(`${errorMessage}: ${cookies}`)
            return {
                status: "err",
                payload: errorMessage
            }

        } else {
            const parsedCookies = cookies.map(cookie => {
                return `${cookie.name}=${cookie.value}`
            }).join("; ")
            return {
                status: "ok",
                payload: parsedCookies
            }
        }
    }

}

export type SessionError = {
    status: "err",
    payload: string
}

export type SessionOk = {
    status: "ok",
    payload: SessionManager
}

function makeError(message: string) {
    return {
        status: "err",
        payload: message
    }
}

export class SessionManager{
    cookies: string
    private constructor(cookies: string) {
        this.cookies = cookies
    }

    static createSession(): SessionOk | SessionError {
        const cookiesManager = new CookiesManager()
        const cookiesState = cookiesManager.getCookies()
        if (cookiesState.status === "err") {
            console.warn(cookiesState.payload)
            return cookiesState
        } else {
            return {
                status: "ok",
                payload: new SessionManager(cookiesState.payload)
            }
        }
    }

    getSessionHeader() : Headers{
        const headers = new Headers({
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Accept-Language": "en-US,en;q=0.5",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
            "Referer": "https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1733815410957&startDate=1639207410957&categoryId=0&offset=0&limit=50&tabName=SOLD&tz=Australia%2FSydney",
            "Host": "www.ebay.com.au",
            "X-Requested-With": "XMLHttpRequest",
            "Expires": "Sat, 01 Jan 2000 00:00:00 GMT",
            "Cookie": this.cookies
        })
        return headers
    }
}




(async () => {
    // const cookies = await CacheCookie.authenticate("chrome")
    // console.log(cookies.cookies)
    const request_str = "https://www.ebay.com.au/sh/research/api/search?marketplace=EBAY-AU&keywords=steam deck&dayRange=1095&endDate=1733815410957&startDate=1639207410957&categoryId=0&offset=0&limit=50&tabName=SOLD&tz=Australia/Sydney&modules=aggregates&modules=searchResults&modules=resultsHeader"

    const headers = new Headers({
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en-US,en;q=0.5",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:131.0) Gecko/20100101 Firefox/131.0",
        "Referer": "https://www.ebay.com.au/sh/research?marketplace=EBAY-AU&keywords=steam+deck&dayRange=1095&endDate=1733815410957&startDate=1639207410957&categoryId=0&offset=0&limit=50&tabName=SOLD&tz=Australia%2FSydney",
        "Host": "www.ebay.com.au",
        "X-Requested-With": "XMLHttpRequest",
        "Expires": "Sat, 01 Jan 2000 00:00:00 GMT",
    })

    //headers.set("Cookie", cookie)
    headers.set("Cookie", "dp1=bu1p/am9uZ3UtNjQ*6b1a5806^kms/in6b1a5806^pbf/%232000000e000e0000000800000000469392486^u1f/Gia6b1a5806^expt/0001733733646770684746ce^bl/AUen-AU6b1a5806^; nonsession=BAQAAAZJU03gwAAaAAAQACGia//Nqb25ndS02NAAQAAhpOSSGam9uZ3UtNjQAMwAIaTkkhjI1NjYsQVVTAEAACGk5JIZqb25ndS02NACcADhpOSSGblkrc0haMlByQm1kajZ3Vm5ZK3NFWjJQckEyZGo2TUZtSUdpQ1ppS3FBbWRqNng5blkrc2VRPT0AnQAIaTkkhjAwMDAwMDAxAMoAIGsaWAYzYmFiZGJjYTE5MTBhNzM0Nzk0MzI1NTdmZmZkYzNlNwDLAAJnV/gOMzQBZAAHaxpYBiMwMDQwOGE7nNKcm2CRO6pxxLzcfUZF19Rqow**; __deba=ZXQ3b2L1ZMZSsug8-LpFYEVmwvtpyOKpLjt75nTJcqEQ7HUCPq2wzuhhzA2V5fQG8EvSLzAl2I1XMdnWzJ1VL89dlwo7OYpkVzDEbq7-BsjWFuPdscdNFQCjpWncEOJsWNrppttGm5DQ_XeC4cVgkw==; __uzma=55e14757-c44d-41d9-9cc1-4fa9241a7fc6; __uzmb=1723283005; __uzmc=64787366157633; __uzmd=1733816582; __uzme=6263; __uzmf=7f6000685e63cd-3d04-4f75-b79c-869ab7d95758172328300523710533576779-ca1b360888e256953661; ns1=BAQAAAZJU03gwAAaAAKUADWk5JIYyMTgzMzE4ODk1LzA7ANgAU2k5JIZjNjl8NjAxXjE3MjMyODMwMTAzOTZeXjFeM3wyfDV8NHw3fDEwfDQyfDQzfDExXl5eNF4zXjEyXjEyXjJeMV4xXjBeMV4wXjFeNjQ0MjQ1OTA3NTUqTyacMefvIar+1lrZWpKTvXL4; __ssds=3; __ssuzjsr3=a9be0cd8e; utag_main__sn=98; cid=XxCyjHFsbK6uGpfv%231331444930; shs=BAQAAAZOJ0QgqAAaAAVUAD2ia//MyMjE4NDQxNjc4MDA2LDJBi+7Z9d/rRq+ETwJ0oK2FLdiezg**; forterToken=c12768e4addb4b38b9c8bf5d0972f0b8_1726723774714_27_UAS9_15ck; s=CgAD4ACBnWPIFM2JhYmRiY2ExOTEwYTczNDc5NDMyNTU3ZmZmZGMzZTcVFyoN; ebay=%5Ejs%3D1%5Esbf%3D%23000000%5E; ds2=ssts/1733795979163^; bm_sv=5EC57D64A5362E8340E1F7464C9D1B80~YAAQH03cF91EG6+TAQAATIWFrxof0jD8JTsoWZym2rxOAPJbKsUvjaJ0QLAHVxwX/zx4teY6igBpr7A7c/aaJn+D6CAgAp157byz6DHkVYCarDG4oA5xc/6GYCFBuA3h/dk5iMb3Lmt0BasU++63q0FsCsijfTc4SuONr/npOZN5AzWglIQgUq4Mwch24oxioH31SqcblOpxdGIvAH1jgu+eSl9UE8GxuBDjp7qbTmb8Cm3DRoHqmCZXc5+SwACfgKM=~1")

    const resp = await fetch(request_str, {
        method: "GET",
        headers: headers
    })

    const data = resp.headers.getSetCookie()
    console.log(data)
})
