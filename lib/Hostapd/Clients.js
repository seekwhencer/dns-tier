import {spawn} from 'child_process';
import Module from '../Global/Module.js';

export default class Dnsmasqfile extends Module {
    constructor(parent) {
        super();
        this.parent = parent;
        this.app = this.parent.app;
        this.options = this.app.preset.data.hostapd;
        this.label = 'HOSTAPD CLIENTS';

        LOG(this.label, 'INIT');

        this.on('scan-complete', data => {
            this.options.repeat_scan ? this.scan() : null;
            this.parseScan(data);
        });

        this.scan();
    }

    command(bin, params) {
        return new Promise((resolve, reject) => {
            LOG(this.label, '>>> COMMAND', bin, JSON.stringify(params));
            let data = '';
            const process = spawn(bin, params);
            process.stdout.on('data', chunk => data += chunk);
            process.stdout.on('end', () => resolve(data));
        });
    }

    scan(repeat) {
        repeat ? this.options.repeat_scan = repeat : null;
        this
            .command('/usr/sbin/arp-scan', ['--interface=wlan0', '--localnet'])
            .then(data => this.emit('scan-complete', data));
    }

    parseScan(data) {
        LOG(this.label, 'PARSE SCANED DATA', data);
    }
}