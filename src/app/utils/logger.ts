function is_logging(value: any, {name, kind}: {name: any, kind: any}) {
    if (kind === 'method') {
        if (process.env.ROLLUP_ENV !== 'production') {
            return (...args: any[]) => {
                return value(args)
            }
        }
    }
}
export default class logging {
    @is_logging
    static warn(...params: any[])  {
        console.warn('%c [Warn]', 'background: #000; color:rgb(175, 207, 57); font-weight: 600', ...params);
    }

    @is_logging
    static debug(...params: any[])  {
        console.debug('%c [Debug]', 'background: #000; color:rgb(39, 48, 180); font-weight: 600', ...params);
    }

    @is_logging
    static error(...params: any[])  {
        console.error('%c [Error]', 'background: #000; color:rgb(202, 8, 8); font-weight: 600', ...params);
    }

    @is_logging
    static info(...params: any[])  {
        console.info('%c [Info]', 'background: #000; color:rgb(24, 209, 24); font-weight: 600', ...params);
    }
}