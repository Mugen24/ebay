"use  client"
import axios from "axios";

const BASE = "/api"
export async function search(): Promise<any | undefined> {
    const path= `${BASE}/search`;
    const resp = await axios.get(path)
    if (resp.status === 202) {
        return resp.data
    } else {
        return undefined
    }
}

function useApi() {
}