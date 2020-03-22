import Module from '../Global/Module.js';
import Accesspoint from './Accesspoint.js';

export default class Hostapd extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.hostapd;
            this.label = 'HOSTAPD';

            LOG(this.label, 'INIT');

            this.items = [];

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
                resolve(this);
            });

            this
                .createAccesspoints()
                .then(() => this.emit('ready'));

        });
    }

    /**
     *
     * @param index
     * @returns {PromiseLike<T | never> | Promise<T | never>|Promise<void>}
     */
    createAccesspoints(index) {
        !index ? index = 0 : null;
        if (!this.options[index]) {
            return Promise.resolve();
        } else {
            if (this.options[index].enable === false) {
                return Promise.resolve();
            }
            return this.createAccesspoint(index).then(() => {
                return this.createAccesspoints(index + 1);
            });
        }
    }

    /**
     *
     * @param index
     * @returns {PromiseLike<void | never> | Promise<void | never>}
     */
    createAccesspoint(index) {
        const presetData = this.options[index];
        return new Accesspoint(this, presetData).then(accesspoint => {
            this.items.push(accesspoint);
            return Promise.resolve();
        });
    };
}