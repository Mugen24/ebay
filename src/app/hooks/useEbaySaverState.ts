import { useState } from "react";
import { EbaySaverState } from "../EbayApi/EbaySaverState";

export function useParamManager() {
    const [state, setState] = useState<EbaySaverState>(new EbaySaverState())
    return [state, setState]
}