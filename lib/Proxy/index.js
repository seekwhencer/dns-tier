import Module from '../Global/Module.js';

export default class Proxy extends Module {
    constructor(parent){
        super();
        return new Promise((resolve,reject) => {
            this.parent = this.app = parent;

            resolve(this);
        });


    }
}