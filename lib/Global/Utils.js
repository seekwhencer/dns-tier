import path from 'path';

global.P = dir => {
    if (dir.substring(0, 1) === '/') {
        return path.resolve(dir);
    } else {
        return path.resolve(`${APP_DIR}/${dir}`);
    }
};

global.PROP = (target, field, options) => {
    Object.defineProperty(target, field, {
        ...{
            enumerable: false,
            configurable: false,
            writable: true,
            value: false
        },
        ...options
    });
};