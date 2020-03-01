import Module from '../Global/Module.js';
import Redbird from 'redbird';

export default class Proxy extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.proxy;
            this.label = 'REVERSE PROXY';

            LOG(this.label, 'INIT');

            this.engine = new Redbird({
                port: this.options.port,
                xfwd: true,
                ssl: false
            });

            this.registerMapping();

            resolve(this);
        });
    }

    register(host, port) {
        this.engine.register(host, `http://127.0.0.1:${port}`);
    }

    registerMapping() {
        this.options.mapping.forEach(service => {
            this.register(service.host, service.port);
        });
    }
}