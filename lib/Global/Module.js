import Events from './Events.js';
import Crypto from 'crypto';

export default class Module extends Events {
    constructor() {
        super();

        this.items = [];
        this.id =  `${Crypto.createHash('md5').update(`${Date.now()}`).digest("hex")}`; // @TODO random hash
    }

    one(match, field, not) {
        return this.get(match, field, not)[0];
    }

    many(match, field, not) {
        return this.get(match, field, not);
    }

    get(match, field, not) {
        !field ? field = 'id' : null;
        return this.items.filter(item => {
            if (item['field'] === match) {
                return not !== item['field'];
            }
        });
    }
}