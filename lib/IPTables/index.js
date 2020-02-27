import {spawn} from 'child_process';
import Module from '../Global/Module.js';

export default class IPTables extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.iptables;
            this.label = 'IPTABLES';

            LOG(this.label, 'INIT');

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this.init().then(() => resolve(this));
        });
    }


    init() {
        return Promise.all([
            this.postroute(this.options.config.from),
            this.forward(this.options.config.from, this.options.config.to)
        ]);
    }

    postroute(from) {
        return this.command(['-t', 'nat', '-A', 'POSTROUTING', '-o', from, '-j', 'MASQUERADE']);
    }

    forward(from, to) {
        const proms = [
            this.command(['-A', 'FORWARD', '-i', from, '-o', to, '-m', 'state', '--state', 'RELATED,ESTABLISHED', '-j', 'ACCEPT']),
            this.command(['-A', 'FORWARD', '-i', to, '-o', from, '-j', 'ACCEPT']),
            this.command(['-A', 'INPUT', '-j', 'ACCEPT', '>>', '/dev/null', '2>&1']),
            this.command(['-A', 'OUTPUT', '-j', 'ACCEPT', '>>', '/dev/null', '2>&1'])
        ];

        return Promise.all(proms);
    }

    command(params) {
        return new Promise((resolve, reject) => {
            LOG(this.label, '>>> COMMAND', JSON.stringify(params));
            const process = spawn(this.app.config.bin.iptables, params);
            process.stdout.on('end', () => resolve());
        });
    }
}