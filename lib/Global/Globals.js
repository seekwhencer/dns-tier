import './Utils.js';
import path from 'path';
import Log from './Log.js';
import Package from '../../package.json';
import * as Express from 'express';
import Ramda from 'ramda';

global.DEBUG = process.env.NODE_DEBUG || true;
DEBUG === 'true' ? global.DEBUG = true : null;
DEBUG === 'false' ? global.DEBUG = false : null;

new Log();

// register some global events
process.on('uncaughtException', error => {
    LOG('ERROR:', error);
});

// on
process.on('SIGINT', () => {

    try{
        DNSTIER.network.stutdown();
    } catch(e){
        // ...
    }

    // some graceful exit code
    setTimeout(() => {
        process.exit(0);
    }, 2000); // wait 2 seconds
});

process.stdin.resume();

global.APP_DIR = path.resolve(process.env.PWD);
global.PACKAGE = Package;
global.ENV = process.env.NODE_ENV || 'default';

global.EXPRESS = Express.default;
global.APIAPP = EXPRESS();
global.R = Ramda;

LOG('');
LOG('//////////////////');
LOG('RUNNING:', PACKAGE.name);
LOG('VERSION:', PACKAGE.version);
LOG('ENVIRONMENT:', ENV);
LOG('/////////');
LOG('');


