import fs from 'fs-extra';
import Module from '../Global/Module.js';

export default class Preset extends Module {
    constructor(parent, options) {
        super();

        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.label = 'PRESET';

            this.options = options;
            this.path = `${this.parent.path}/${this.options.env}`;

            LOG(this.label, ENV, 'INIT', this.path, this.options);

            this.index = false;
            this.data = false;

            this
                .load()
                .then(() => this.save())  // for testing
                .then(() => resolve(this));

        });
    }

    load() {
        return this
            .loadIndex()
            .then(() => this.loadData());
    }

    loadIndex() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.path).then(index => {
                this.index = index;
                this.index = index.filter(i => {
                    const stat = fs.lstatSync(`${this.path}/${i}`);
                    if (!stat.isDirectory())
                        return true;

                    return false;
                });
                LOG(this.label, ENV, 'INDEX LOADED', index.length);
                resolve();
            });
        });
    }

    loadData() {
        return new Promise((resolve, reject) => {
            this.data = {};
            this.index.map(i => {
                const name = i.replace(/.json/, '');
                this.data[name] = fs.readJsonSync(`${this.path}/${i}`);
            });
            LOG(this.label, ENV, 'DATA LOADED');
            resolve();
        });
    }

    save(name) {
        return new Promise((resolve, reject) => {
            if (name) {
                this.data[name] ? fs.writeJsonSync(`${this.path}/${name}.json`, this.data[name]) : null;
            } else {
                this.index.map(i => {
                    const name = i.replace(/.json/, '');
                    fs.writeJsonSync(`${this.path}/${i}`, this.data[name]);
                });
            }
            LOG(this.label, ENV, 'DATA SAVED');
            resolve();
        });
    }
}