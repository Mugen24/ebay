import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { lstat, lstatSync, openSync, readFileSync, readSync } from "fs";
import { SearchParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
const PATH = "data/config.json"

export interface SaveSearch {
    url: string,
    interval?: number,
}




export function POST(request: NextRequest) {
    request.json()
    .then((value: SaveSearch) => {
        const url = new URL(value.url);
        const searchParams = url.searchParams;

        const params: Record<string, any> = {}
        for (const [key, value] of searchParams.entries()) {
            //don't want to search through older entries
            //Only the newest one
            //Default by ebay
            if (key === "limit") {
                continue
            }
            else if (key === "offset") {
                continue
            } 
            else {
                params[key] = value;
            }
        }
        const fileStat = lstatSync(PATH, {
            throwIfNoEntry: false
        })

        const fd = openSync(PATH, "w+");
        let buffer;
        if (fileStat !== undefined) {
            buffer = Buffer.alloc(fileStat.size)
            readSync(fd, buffer)
        }

        let data: Record<string, Array<string>> ;

        if (buffer === undefined) {
            data = {}
        } else {
            data = JSON.parse(buffer.toString())
        }

        if (data["urls"] === undefined) {
            data["urls"] = []
        }

        const search = new URLSearchParams(params)
        const urlQuery = url.host + "?" + search.toString()
        data["urls"].push(urlQuery)

        //Program might exit before writeFile is done??
        writeFile(PATH + Date.now(), JSON.stringify(data), {
            mode: "w+"
        })
    })
}