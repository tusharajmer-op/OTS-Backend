const LOG_LEVELS = {
    level:
    {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7
    },
    colors: {
        emerg: 'red',
        alert: 'red',
        crit: 'yellow',
        error: 'red',
        warning: 'yellow',
        notice: 'blue',
        info: 'cyan',
        debug: 'green'
    }

};
const LOG_PRIORITY = {
    0: 'emerg',
    1: 'alert',
    2: 'crit',
    3: 'error',
    4: 'warning',
    5: 'notice',
    6: 'info',
    7: 'debug'
};

export {
    LOG_LEVELS,
    LOG_PRIORITY
};