import { getSearchListener, SearchConfigDataType } from "./SearchListener";

class EmailNotificationListener {
    enable : boolean
    constructor() {
        this.enable = false
    }

    notifyListener(data: SearchConfigDataType) {
        if (!this.enable) return

        
    }

}