import {spawn} from 'child_process';
import Module from '../Global/Module.js';
import RunConfig from './RunConfig.js';

export default class Hostapd extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.hostapd;
            this.label = 'HOSTAPD';

            LOG(this.label, 'INIT');

            this.process = false;
            this.runConfig = false;

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this
                .createRunConfig()
                .then(() => resolve(this));

        });
    }

    createRunConfig() {
        return new RunConfig(this).then(runConfig => {
            this.runConfig = runConfig;
            return Promise.resolve();
        });
    }

    start() {
        const processOptions = ['-d', this.runConfig.file];
        LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

        this.process = spawn(this.app.config.bin.hostapd, processOptions);
        this.process.stdout.setEncoding('utf8');
        this.process.stderr.setEncoding('utf8');
        this.process.stdout.on('data', data => this.listenTTY(data));
        this.process.stderr.on('data', data => this.listenTTY(data));
        //this.process.stdout.on('end', () => this.emit('exited'));
        //this.process.stderr.on('end', () => this.emit('exited'));
    }

    listenTTY(data) {
        LOG(this.label, 'TTY', data);
        // the key is the emitted event
        const match = {
            ready: new RegExp('Cache geleert'),
        };
        data = data.replace(new RegExp('\n\n','gi'),'\n');
        const rows = data.split('\n');
        rows.forEach(row => {
            LOG(this.label, 'TTY', row.trim());

            Object.keys(match).forEach(event => {
                const matches = row.match(match[event]);
                matches ? this.emit(event, this) : null;
            });

        });
    }

    stop() {
        this.process.exit();
    }

    restart() {
        this.stop();
        this.start();
    }
}