import fs from 'fs-extra';
import Module from '../Global/Module.js';
import Preset from './Preset.js';

export default class Presets extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.storage = this.app.storage;
            this.label = 'PRESETS';

            this.path = P(`${this.storage.path}/${this.app.config.presets_folder}`);

            LOG(this.label, 'INIT', this.path);

            this.index = false;
            this.preset = false;

            this
                .load()
                .then(() => resolve(this));
        });
    }

    load() {
        return this
            .loadIndex()
            .then(() => this.loadActivePreset());
    }

    // all existing environments inside the presets folder
    loadIndex() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.path).then(index => {
                this.index = index.filter(i => {
                    const stat = fs.lstatSync(`${this.path}/${i}`);
                    if (stat.isDirectory())
                        return true;

                    return false;
                });

                LOG(this.label, 'INDEX LOADED', index);
                resolve();
            });
        });
    }

    loadActivePreset() {
        return this.loadPreset(ENV).then(preset => {
            this.preset = preset;
            return Promise.resolve();
        });
    }

    loadPreset(env) {
        return new Preset(this, {
            env: env
        });
    }

    get path() {
        return this._path;
    }

    set path(val) {
        this._path = val;
    }
}