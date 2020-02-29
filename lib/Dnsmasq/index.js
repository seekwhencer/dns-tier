import {spawn} from 'child_process';
import Module from '../Global/Module.js';
import RunConfig from './RunConfig.js';

export default class Dnsmasq extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.dnsmasq;
            this.label = 'DNSMASQ';

            LOG(this.label, 'INIT');

            this.process = false;
            this.runConfig = false;

            this
                .createRunConfig()
                .then(() => this.start())
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
        return new Promise((resolve, reject) => {
            const processOptions = ['-C', this.runConfig.file, '--no-daemon'];
            LOG(this.label, 'STARTING WITH OPTIONS', JSON.stringify(processOptions));

            this.process = spawn(this.app.config.bin.dnsmasq, processOptions);
            this.process.stderr.setEncoding('utf8');
            this.process.stdout.setEncoding('utf8');
            this.process.stderr.on('data', data => this.listenTTY('err', data));
            this.process.stdout.on('data', data => this.listenTTY('out', data));

            this.removeAllListeners('started');
            this.on('started', () => {
                LOG(this.label, '>>> STARTED');
                resolve();
            });
        });
    }

    listenTTY(console, data) {
        // the key is the emitted event
        const match = {
            started: new RegExp('Cache geleert'),
        };

        const rows = data.split('\n');
        rows.forEach(row => {
            if (this.options.verbose === 2)
                LOG(this.label, 'TTY', row);

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