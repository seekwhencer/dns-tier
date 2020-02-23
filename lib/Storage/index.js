import Module from '../Global/Module.js';

export default class Storage extends Module {
    constructor(parent){
        super();
        return new Promise((resolve,reject) => {
            this.parent = this.app = parent;
            this.label = 'STORAGE';

            this.path = P(`${this.app.config.storage_folder}`);

            LOG(this.label, 'INIT', this.path);

            resolve(this);
        });
    }
}