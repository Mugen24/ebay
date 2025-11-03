function is_logging(classtype: logging, methodName: string, propertyDescriptor: PropertyDescriptor) {
    // if (process.env.ROLLUP_ENV !== 'production') {
    //     propertyDescriptor.value = () => {}
    // }

    // console.log("is_loggin: ", value ,test, args)
    // if (kind === 'method') {
    //     if (process.env.ROLLUP_ENV !== 'production') {
    //         return (...args: any[]) => {
    //             return value(args)
    //         }
    //     }
    // }
}

function trace(classType: logging, methodName: string, propertyDesc: PropertyDescriptor) {
    console.log(propertyDesc)
    const old = propertyDesc.value
    propertyDesc.value = (...args: any[]) => {
        old(...args)
        console.trace()
    }
}




export default class logging {
    static DEBUG_ONLY(state: string) {
        return (state === "debug") 
    }

    static condition(state: string) {
        return true
    }

    // @is_logging
    static warn(...params: any[])  {
        if (logging.condition("warn")) {
            console.warn('%c [Warn]', 'background: #000; color:rgb(175, 207, 57); font-weight: 600', ...params);
        }

    }

    // @is_logging
    static debug(...params: any[])  {
        if (logging.condition("debug")) {
            console.debug('%c [Debug]', 'background: #000; color:rgb(39, 48, 180); font-weight: 600', ...params);
        }
    }

    // @is_logging
    static error(...params: any[])  {
        if (logging.condition("error")) {
            console.error('%c [Error]', 'background: #000; color:rgb(202, 8, 8); font-weight: 600', ...params);
        }
    }

    // @is_logging
    static info(...params: any[])  {
        if (logging.condition("info")) {
            console.info('%c [Info]', 'background: #000; color:rgb(24, 209, 24); font-weight: 600', ...params);
        }
    }

    // @is_logging
    static group(label: string) {
        console.group(label)
    }

    // @is_logging
    static groupEnd() {
        console.groupEnd()
    }
}
